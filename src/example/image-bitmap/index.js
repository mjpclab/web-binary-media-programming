// update preview

fileinput.addEventListener("change", e => {
  const file = e.target.files[0];
  onFileUpdate(file);
});

document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => {
  e.preventDefault();
  const file = e.dataTransfer.files?.[0];
  onFileUpdate(file);
});

const onFileUpdate = async file => {
  let bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap = await createImageBitmap(
    bitmap,
    width / 4,
    height / 4,
    width / 2,
    height / 2,
    {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "medium",
    }
  );

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  canvas.toBlob(blob => {
    const blobUrl = URL.createObjectURL(blob);
    preview.src = blobUrl;
    download.href = blobUrl;
  });
};
