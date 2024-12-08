# Canvas 及其 Context

在 HTML5 中，Canvas（画布）是用于展现图形绘制结果的容器，它包含少量的方法用于将绘制的图像导出到其它二进制格式，比如 Blob、Data URL 等。

除了常用的`HTMLCanvasElement`（`<canvas>`元素实例），比较常用的还有`OffscreenCanvas`，它不会在屏幕上显示，同时解耦了与 DOM 的交互，因而可以运行在 Worker 线程中，使得在执行较复杂的图形任务时不会阻塞主线程。

## 创建 Canvas

对于`HTMLCanvasElement`，可通过 HTML 创建，再通过脚本获取其 DOM 实例，也可以通过纯脚本的方式创建：

```html
<canvas width="100" height="100"></canvas>
```

```javascript
// 获取HTML页面中的canvas
const canvas1 = document.querySelector("canvas");

// 纯脚本方式创建canvas
const canvas2 = document.createElement("canvas");
canvas2.width = 100;
canvas2.height = 100;
```

`HTMLCanvasElement`的`width`和`height`属性用于设置画布内容的宽高，它独立于 DOM 与 CSS 的坐标系，因而通过改变 CSS 样式的宽高会缩放 Canvas，而无法改变画布中绘图区域的大小。改变`HTMLCanvasElement`的`width`和`height`属性还会导致画布内容被清空。

而`OffscreenCanvas`只能通过脚本创建，在创建时就必须指定画布大小：

```javascript
const canvas = new OffscreenCanvas(100, 100);
```

## 获取绘图上下文（Context）

主要的图形绘制接口并不在 Canvas 上，而是通过使用被称为 Context 的对象实现的。一个 Canvas 只可以创建一个对应的 Context。Context 种类有很多，本书只讨论用于二维平面图形绘制的 Context。

获取 Context 对象的方法很简单：

```javascript
// 获取一个 2D Context 对象
const context = canvas.getContext("2d");
```

对于`HTMLCanvasElement`，调用`getContext("2d")`方法返回`CanvasRenderingContext2D`，而在`OffscreenCanvas`上调用则返回`OffscreenCanvasRenderingContext2D`，后者是前者的扩展。

## 将已有的图像资源绘制到画布上

`CanvasRenderingContext2D.drawImage()`方法可以将 Web 页面中现有的图像资源绘制到画布上，语法：

```javascript
context.drawImage(image, dx, dy);
context.drawImage(image, dx, dy, dw, wh);
context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
```

其中`image`为图像来源，可以是任意类型的 Canvas、`HTMLImageElement`（`<img>`标签实例）、`HTMLVideoElement`（`<video>`标签实例）或[`ImageBitmap`](image-bitmap.md)。例如，将源图像左上角四分之一区域绘制到画布右下角：

```javascript
const img = document.querySelector("img");
const srcW = Math.floor(img.naturalWidth / 2);
const srcH = Math.floor(img.naturalHeight / 2);

const canvas = document.querySelector("canvas");
const canvasW = canvas.width;
const canvasH = canvas.height;

const context = canvas.getContext("2d");
context.drawImage(
  img,
  0,
  0,
  srcW,
  srcH,
  canvasW - srcW,
  canvasH - srcH,
  srcW,
  srcH
);
```

## HTMLCanvasElement 和二进制操作有关的方法

注意：如果 Canvas 上绘制了来自第三方域的图像，而没有配置跨域授权，一些转化方法会执行失败。例如，通过`context.drawImage`从`src`指向第三方域的`<img>`绘制图像到 Canvas 上，那么`canvas.toDataURL()`或`canvas.toBlob()`会失败并抛出错误：Tainted canvases may not be exported。

### `toDataURL()`转化图像为 Data URL

`toDataURL()`方法将 Canvas 上的图像转化成 Data URL，语法：

```javascript
canvas.toDataURL();
canvas.toDataURL(type);
canvas.toDataURL(type, quality);
```

`type`指定要转化的图片 MIME 类型，默认为`image/png`，可以设置如`image/jpeg`或`image/webp`这样的类型，视浏览器的支持情况而定。当浏览器不支持指定的类型时，会使用默认的类型`image/png`。

`quality`用于指定有损压缩格式的图像质量，介于`0`到`1`之间。

```javascript
const url = canvas.toDataURL();
// data:image/png;base64,...
```

### `toBlob()`转化图像为 Blob

语法：

```javascript
canvas.toDataURL(callback);
canvas.toDataURL(callback, type);
canvas.toDataURL(callback, type, quality);
```

与`toDataURL()`不同，`toBlob()`是一个异步回调方法，回调函数`callback`接收一个参数，其值为 Blob 类型，或者在转化过程中由于任何原因导致失败，会传入`null`。

```javascript
canvas.toDataURL(
  blob => {
    // if (blob) { ... }
  },
  "image/webp",
  0.9
);
```

### `captureStream()`抓取为视频流

如在 Canvas 上绘制动画，即不停地重绘画布，可以通过`captureStream()`获取一个`MediaStream`流对象，其中包含了视频轨`MediaStreamTrack`。

语法：

```javascript
canvas.captureStream([frameRate]);
```

可选的`frameRate`用于指定视频采集帧率。如不提供该值，则只在每次 Canvas 发生变化时采集一帧；如设置为`0`，则不会自动采集帧信息，而是需要手动调用`CanvasCaptureMediaStreamTrack.requestFrame()`触发采集动作。

```javascript
const stream = canvas.captureStream();

const video = document.querySelector("video");
video.srcObject = stream;
```

### `transferControlToOffscreen()`将控制权转移到 OffscreenCanvas

`transferControlToOffscreen()`将绘图控制权转移到新的`OffscreenCanvas`上，通过在`OffscreenCanvas`上创建 Context 并调用对应的绘图方法来绘图，最终会绘制在原始 Canvas 的画布上。注意原始 Canvas 不能创建 Context，否则调用此方法会失败。

调用此方法后产生的`OffscreenCanvas`可以传送到 Worker 线程中，执行计算量较大的操作，而不会阻塞主线程。

```javascript
// 主线程
const canvas = document.querySelector("canvas");
const osCanvas = canvas.transferControlToOffscreen();
const worker = new Worker("worker.js");
worker.postMessage({ canvas: osCanvas }, [osCanvas]);
```

```javascript
// Worker线程
addEventListener("message", ({ data: { canvas } }) => {
  const context = canvas.getContext("2d");
  context.strokeRect(10, 10, 50, 50);
});
```

## OffscreenCanvas 和二进制操作有关的方法

### `convertToBlob()`转化为 Blob

### `transferToImageBitmap()`导出 ImageBitmap
