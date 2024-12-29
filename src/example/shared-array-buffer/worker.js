addEventListener("message", e => {
  setTimeout(() => {
    if (e.data instanceof SharedArrayBuffer) {
      console.log(new Uint8Array(e.data));
    } else {
      console.log(e.data);
    }
  });
});
