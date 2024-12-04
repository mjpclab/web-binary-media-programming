# FileReaderSync

`FileReaderSync`是`FileReader`的同步模式版本，它没有状态和进度事件，而是在读取数据时阻塞当前线程直到完成，返回读取到的值，在出错时直接抛出错误。由于 FileReaderSync 读取数据时会阻塞线程，因而只能在 Worker（非 Service Worker） 中使用。

`FileReaderSync`读取数据的方法会同步地返回所请求的数据：

- `readAsArrayBuffer()`返回 ArrayBuffer
- `readAsText()`返回 string
- `readAsDataURL()`返回`data:`形式的 URL

```javascript
// 主线程
const worker = new Worker("worker.js");
worker.postMessage(new Blob(["hello world"]));
worker.addEventListener("message", e => {
  console.log(`got message from worker: ${e.data}`);
});
```

```javascript
// Worker线程
addEventListener("message", ({ data }) => {
  if (!(data instanceof Blob)) {
    return;
  }

  const reader = new FileReaderSync();
  const text = reader.readAsText(data);
  postMessage(text);
});
```

```
got message from worker: hello world
```
