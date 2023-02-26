import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Background,
} from "reactflow";
import { useState, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import {
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { stableDiffusion, whisper } from "./api";

let id = 1;
const getId = () => `${id++}`;

export default function Flow() {
  const [promptOpen, setPromptOpen] = useState(false);
  const [audioFile, setAudioFile] = useState("");
  const [output, setOutput] = useState(null);

  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleClickOpen = () => {
    setPromptOpen(true);
  };

  const handleClose = () => {
    setPromptOpen(false);
  };

  const addNode = (label) => (event) => {
    const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
    const id = getId();
    const y = nodes.length === 0 ? 50 : nodes[nodes.length - 1].position.y + 75;
    const newNode = {
      id,
      position: project({ x: left, y }),
      data: { label },
    };

    setNodes((nds) => nds.concat(newNode));
    nodes.length > 0 &&
      setEdges((eds) =>
        eds.concat({ id, source: nodes[nodes.length - 1].id, target: id })
      );
  };

  const run = async () => {
    console.log(nodes.length);
    const text = nodes.length >= 3 ? await stableDiffusion() : await whisper();
    setOutput(text);
  };

  return (
    <>
      <Box
        ref={reactFlowWrapper}
        width="100%"
        height="100%"
        sx={{ ml: "300px" }}
      >
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Background />
        </ReactFlow>
      </Box>

      <DialogBox
        handleClose={handleClose}
        handleClick={addNode("Audio File")}
        open={promptOpen}
      />

      <OutputBox
        handleClose={() => {
          setOutput(null);
        }}
        value={output}
        open={output !== null}
      />

      <Drawer
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Stack justifyContent="space-between" sx={{ height: "100%" }}>
          <List>
            <List component="div" disablePadding>
              <ListItemButton>
                <ListItemText primary="Storage" />
              </ListItemButton>
            </List>
            <List component="div" disablePadding>
              <ListItemButton onClick={() => handleClickOpen()} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Audio File" />
              </ListItemButton>
              <ListItemButton onClick={addNode("Text")} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Text" />
              </ListItemButton>
            </List>

            <List component="div" disablePadding>
              <ListItemButton>
                <ListItemText primary="AI Models" />
              </ListItemButton>
            </List>
            <ListItemButton
              onClick={addNode("Stable Diffusion")}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Stable Diffusion" />
            </ListItemButton>
            <ListItemButton onClick={addNode("Whisper")} sx={{ pl: 4 }}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Whisper" />
            </ListItemButton>
          </List>
          <Button onClick={run} sx={{ mb: 10, mx: 8 }} variant="contained">
            Run
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}

function DialogBox({ handleClose, handleClick, open }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Audio File URL"
          type="email"
          sx={{ width: 400 }}
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleClose();
            handleClick();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OutputBox({ handleClose, open, value }) {
  if (value === null) return null;
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ minWidth: 500 }}>
        {value.indexOf("http") === 0 ? (
          <img src={value} style={{ width: "100%", height: "100%" }} />
        ) : (
          value
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
