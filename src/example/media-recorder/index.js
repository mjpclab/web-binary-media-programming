const video = document.querySelector("video");
const [btnStart, btnStop] = document.querySelectorAll("button");
const list = document.querySelector("ul");

(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { facingMode: "user" },
  });
  video.srcObject = stream;
  video.play();

  let chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
  recorder.addEventListener("dataavailable", e => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", e => {
    const blob = new Blob(chunks, { type: recorder.mimeType });
    chunks = [];

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.target = "_blank";
    link.textContent = new Date().toLocaleTimeString();

    const item = document.createElement("li");
    item.append(link);
    list.append(item);
  });

  btnStart.disabled = false;

  btnStart.addEventListener("click", () => {
    btnStart.disabled = !btnStart.disabled;
    btnStop.disabled = !btnStop.disabled;
    recorder.start();
  });

  btnStop.addEventListener("click", () => {
    btnStart.disabled = !btnStart.disabled;
    btnStop.disabled = !btnStop.disabled;
    recorder.stop();
  });

  document.body.addEventListener("dblclick", () => {
    if (recorder.state === "recording") {
      recorder.pause();
    } else if (recorder.state === "paused") {
      recorder.resume();
    }
  });

  console.log("state:", recorder.state);
  function onEventFired(e) {
    console.log(`event: ${e.type}, state: ${this.state}`);
  }
  recorder.addEventListener("start", onEventFired);
  recorder.addEventListener("stop", onEventFired);
  recorder.addEventListener("pause", onEventFired);
  recorder.addEventListener("resume", onEventFired);
})();
