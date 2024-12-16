# MediaStream 与 MediaStreamTrack

`MediaStream`表示一个可以播放的媒体流，其底层数据对开发者不可见，即是一个黑盒。可以认为`MediaStream`是一个存放媒体的容器，真正的媒体以媒体轨道（`MediaStreamTrack`）的形式储存在`MediaStream`中。

## 抓取 Canvas 视频流

我们已经在 Canvas 的章节中提到了 Canvas 的`captureStream()`方法可以获得一个`MediaStream`实例。现在，让我们尝试在 Canvas 上绘制动画，然后从中提取一个`MediaStream`（其中包含一个`MediaStreamTrack`视频轨），最后使用`<video>`元素来播放该媒体流。

先准备 HTML 结构

```html
<canvas width="100" height="100"></canvas> <video muted controls></video>
```

先在 canvas 上绘制不断循环右移的小方格，作为 canvas 动画的示例：

```javascript
const canvas = document.querySelector("canvas");
const { width, height } = canvas;
const context = canvas.getContext("2d");

let x = 0;
const redraw = () => {
  context.fillStyle = "#f1f1f1";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "yellowgreen";
  context.fillRect(x, 20, 20, 20);

  x = (x + 1) % width;
  requestAnimationFrame(redraw);
};
redraw();
```

确认动画已正常绘制后，我们从 canvas 抓取一个包含视频媒体轨（`MediaStreamTrack`）的媒体流（`MediaStream`）：

```javascript
const stream = canvas.captureStream();
console.log(stream instanceof MediaStream); // true

const video = document.querySelector("video");
video.srcObject = stream;
video.play();
```

当获取到`MediaStream`后，我们将其赋值给`<video>`元素的`srcObject`属性，并调用`play()`方法启动播放。
