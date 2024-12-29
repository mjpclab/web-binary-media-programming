const buffer = new SharedArrayBuffer(8);
const arr = new Uint16Array(buffer);

const worker = new Worker("worker.js");
worker.postMessage(buffer);
worker.postMessage(arr);
arr[0] = 257;
