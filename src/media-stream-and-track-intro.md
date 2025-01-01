# 初识 MediaStream 与 MediaStreamTrack

`MediaStream`表示一个可以播放的媒体流，其底层数据对开发者不可见，即是一个黑盒。可以认为`MediaStream`是一个存放媒体的容器，真正的媒体以媒体轨道（`MediaStreamTrack`）的形式存在于`MediaStream`中。

## 从 Canvas 抓取视频流

我们已经在 Canvas 的章节中提到了 Canvas 的`captureStream()`方法可以获得一个`MediaStream`实例。现在，让我们尝试在 Canvas 上绘制动画，然后从中提取一个`MediaStream`（其中包含一个`MediaStreamTrack`视频轨），最后使用`<video>`元素来播放该媒体流。

先准备 HTML 结构

```html
<body>
  <canvas width="100" height="100"></canvas>
  <video muted controls playsinline></video>
</body>
```

在 canvas 上绘制不断循环右移的小方格，作为 canvas 动画的示例：

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

## 抓取本地麦克风和摄像头的音视频流

我们可以通过`navigator.mediaDevices.getUserMedia()`来请求获取本地麦克风和摄像头的音视频流。

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});
```

由于此操作涉及用户隐私，调用该方法有一些限制：

- 当前所在页面域名为`localhost`或协议为`https:`，即只允许在本地调试或 HTTPS 安全环境下使用。
- 需要用户主动授权，浏览器 UI 可能会提示用户进行授权，且无法通过脚本控制该 UI 的行为。如果用户不执行授权操作（既不允许也不拒绝），返回的 Promise 会一直处于 pending 状态。

调用`getUserMedia()`时传入的参数`audio: true`代表请求包含来自麦克风的音频轨，`video: true`代表请求包含来自摄像头的视频轨。

获取到流以后，也可以像上例那样，使用 video 元素来播放。注意避免音频循环回音，即播放出来的声音再次被麦克风采集，而造成循环并不断加强。

如果只想获取音频或视频中的一种，可以只指定`audio`或`video`其中之一为`true`，或者将另一个类型设为`false`：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
```

## 从 MediaStream 提取 MediaStreamTrack

可以通过`MediaStream`的实例方法获取到其中的多个轨道（`MediaStreamTrack`）：

- `getTracks()`：以数组形式返回`MediaStream`中所有的`MediaStreamTrack`
- `getAudioTracks()`以数组形式返回`MediaStream`中所有的音频`MediaStreamTrack`
- `getVideoTracks()`以数组形式返回`MediaStream`中所有的视频`MediaStreamTrack`

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});

const tracks = stream.getTracks();
tracks; // [MediaStreamTrack]
```

请观察上例中返回的 MediaStreamTrack 对象有哪些属性，然后尝试修改代码获取视频轨，并再次观察视频轨上有哪些属性。
