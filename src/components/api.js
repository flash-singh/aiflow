// const runpodApiId = "";
// const headers = {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${runpodApiId}`,
// };

export async function whisper(file) {
  //   const inputData = {
  //     input: {
  //       audio:
  //         "https://storiestogrowby.org/wp-content/uploads/2016/03/Fur-Feather-Africa.mp3",
  //     },
  //   };
  //   const response = await fetch("https://api.runpod.ai/v1/whisper/run", {
  //     method: "POST",
  //     headers,
  //     body: JSON.stringify(inputData),
  //   });
  //   const { id } = await response.json();

  //   const status = await fetch(`https://api.runpod.ai/v1/whisper/status/${id}`, {
  //     headers,
  //   });
  //   const statusData = await status.json();

  //   console.log(statusData);

  return new Promise((resolve) => {
    setTimeout(() => resolve("astronaut looking at a nebula", 1000));
  });
}

export async function stableDiffusion() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("http://localhost:3000/astronaut.jpeg", 1000));
  });
}
