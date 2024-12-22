const video = document.querySelector("video");
const button = document.querySelector("button");

(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      aspectRatio: 9 / 16,
      facingMode: "user",
    },
  });
  video.srcObject = stream;
  await video.play();
  const width = video.videoWidth;
  const height = video.videoHeight;

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");
  context.scale(-1, 1);
  context.translate(-width, 0);

  button.addEventListener("click", async () => {
    context.clearRect(0, 0, width, height);
    context.drawImage(video, 0, 0);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "portrait.png";
    link.href = url;
    link.click();
  });
})();
