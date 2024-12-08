addEventListener("message", ({ data: { canvas } }) => {
  const context = canvas.getContext("2d");
  context.strokeRect(10, 10, 50, 50);
});
