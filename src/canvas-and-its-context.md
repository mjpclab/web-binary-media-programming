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

`HTMLCanvasElement`的`width`和`height`属性用于设置画布内容的宽高，它独立于 DOM 与 CSS 的坐标系，因而通过改变 CSS 样式的宽高会缩放 Canvas，而无法改变画布中绘图区域可用空间的大小。改变`HTMLCanvasElement`的`width`和`height`属性还会导致画布内容被清空。

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

`canvasRenderingContext2D.drawImage()`方法可以将 Web 页面中现有的图像资源绘制到画布上，语法：

```javascript
context.drawImage(image, dx, dy);
context.drawImage(image, dx, dy, dw, wh);
context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
```

其中`image`为图像来源，可以是`HTMLCanvasElement`（`<canvas>`标签实例）、`OffscreenCanvas`、`HTMLImageElement`（`<img>`标签实例）、`HTMLVideoElement`（`<video>`标签实例）或[`ImageBitmap`](image-bitmap.md)。例如，将源图像左上角四分之一区域绘制到画布右下角：

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

注意：如果 Canvas 上绘制了来自第三方源的图像，而没有配置跨源授权，一些转化方法会执行失败。例如，调用`context.drawImage`从`src`指向第三方源的`<img>`绘制图像到 Canvas 上，那么`canvas.toDataURL()`或`canvas.toBlob()`会失败并抛出错误：Tainted canvases may not be exported。

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

与`toDataURL()`不同，`toBlob()`是一个异步回调方法，回调函数`callback`接受一个参数，其值为 Blob 类型，或者在转化过程中由于任何原因导致失败，会传入`null`。

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

可选的`frameRate`用于指定视频采集帧率。如不提供该值，则只在每次 Canvas 发生变化时采集一帧；如设置为`0`，则不会自动采集帧信息，而是需要手动调用`canvasCaptureMediaStreamTrack.requestFrame()`触发采集动作。

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

`convertToBlob()`将 OffscreenCanvas 的图像转化成 Blob 导出，返回`Promise<Blob>`。语法：

```javascript
canvas.convertToBlob();
canvas.convertToBlob(options);
```

可选的`options`对象可以指定导出格式`type`和有损压缩的质量`quality`（`0`~`1`之间）。

### `transferToImageBitmap()`转出到 ImageBitmap

`transferToImageBitmap()`将当前 OffscreenCanvas 图像转出到 ImageBitmap 对象，然后创建新的空白画布用于后续绘图。

## 示例：图像格式转换

本示例接受用户选择的图片文件，然后按照用户选择的目标格式进行转化，并提供下载。其最核心的代码便是 Canvas 所提供的将图像转化为 Blob 的方法。

先准备一个 HTML 页面，除了提供选择文件所用的输入框，还有显示原始图像的`img`标签，以及控制转化输出选项和下载链接的容器元素，默认情况下不显示出来：

```html
<input id="fileinput" type="file" accept="image/*" />
<img id="preview" />
<section id="action" style="display: none">
  <select id="imagetype">
    <option value="image/png">png</option>
    <option value="image/webp">webp</option>
    <option value="image/jpeg">jpeg</option>
  </select>
  <input
    id="imagequality"
    type="number"
    min="0"
    max="1"
    step="0.05"
    value="0.9"
  />
  <a id="download" download>Download</a>
</section>
```

先实现接受用户选择文件的机制，用户通过文件框选择图像文件，或者拖放图像文件到页面上，都将把该图像显示出来，也作为后续图像转换的来源：

```javascript
fileinput.addEventListener("change", e => {
  const file = e.target.files[0];
  updatePreview(file);
});

document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => {
  e.preventDefault();
  const file = e.dataTransfer.files?.[0];
  if (file.type.startsWith("image/")) {
    updatePreview(file);
  }
});

const updatePreview = file => {
  if (!file) return;

  preview.src = URL.createObjectURL(file);
  action.style.display = "block";
};
```

然后，根据用户所选择的转换格式不同，更新下载链接：

```javascript
const updateDownload = async () => {
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
imagetype.addEventListener("change", updateDownload);
imagequality.addEventListener("change", updateDownload);
updateDownload();
```

通过使用`offscreenCanvas.convertToBlob({type, quality})`，我们得到了转化后的 Blob 对象，对其创建 Object URL 后赋到下载链接上，便可用于下载。
