// update preview

fileinput.addEventListener("change", e => {
  const file = e.target.files[0];
  updatePreview(file);
});

document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => {
  e.preventDefault();
  const file = e.dataTransfer.files?.[0];
  updatePreview(file);
});

const updatePreview = file => {
  if (!file) return;

  preview.src = URL.createObjectURL(file);
  action.style.display = "block";
};

// update download

imagetype.addEventListener("change", e => {
  imagequality.style.display =
    e.target.value === "image/png" ? "none" : "inline-block";
});

const updateDownload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = preview.naturalWidth;
  canvas.height = preview.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(preview, 0, 0);
  canvas.toBlob(
    blob => {
      if (blob) {
        download.href = URL.createObjectURL(blob);
      } else {
        download.removeAttribute("href");
      }
    },
    imagetype.value,
    imagequality.valueAsNumber
  );
};
const updateDownload2 = async () => {
  const canvas = new OffscreenCanvas(
    preview.naturalWidth,
    preview.naturalHeight
  );
  const ctx = canvas.getContext("2d");
  ctx.drawImage(preview, 0, 0);
  try {
    const blob = await canvas.convertToBlob({
      type: imagetype.value,
      quality: imagequality.valueAsNumber,
    });
    download.href = URL.createObjectURL(blob);
  } catch (err) {
    download.removeAttribute("href");
  }
};
imagetype.addEventListener("change", updateDownload2);
imagequality.addEventListener("change", updateDownload2);
