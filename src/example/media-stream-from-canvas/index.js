const canvas = document.querySelector("canvas");
const { width, height } = canvas;
const context = canvas.getContext("2d");

let x = 0;
const redraw = () => {
  context.fillStyle = "#f1f1f1";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "yellowgreen";
  context.fillRect(x, 20, 20, 20);

  x = (x + 1) % width;
  requestAnimationFrame(redraw);
};
redraw();

const stream = canvas.captureStream();
const video = document.querySelector("video");
video.srcObject = stream;
video.play();
