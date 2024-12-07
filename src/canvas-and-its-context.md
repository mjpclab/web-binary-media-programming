# Canvas 及其 Context

在 HTML5 中，Canvas 是用于展现图形绘制结果的容器，它包含少量的方法用于将绘制的图像导出到其他二进制格式，比如 Blob 或 Data URL 等。

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

## HTMLCanvasElement 和二进制操作有关的方法

### `toDataURL()`转化图像为 Data URL

### `toBlob()`转化为 Blob

### `captureStream()`抓取为视频流

### `transferControlToOffscreen()`将控制权转移到 OffscreenCanvas

## OffscreenCanvas 和二进制操作有关的方法

### `convertToBlob()`转化为 Blob

### `transferToImageBitmap()`导出 ImageBitmap
