addEventListener("message", ({ data }) => {
  if (!(data instanceof Blob)) {
    return;
  }

  const reader = new FileReaderSync();
  const text = reader.readAsText(data);
  postMessage(text);
});
