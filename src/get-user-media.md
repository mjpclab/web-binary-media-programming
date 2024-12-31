# getUserMedia()方法

`getUserMedia()`方法用于提示用户授权从媒体设备中采集数据，并以`MediaStream`（包含所请求轨道的`MediaStreamTrack`）对象返回。

语法：

```javascript
mediaDevices.getUserMedia(constraints);
```

`getUserMedia()`方法返回 Promise，如果用户拒绝授权，则会被拒绝（reject）。

`constraints`定义了约束条件，浏览器会尝试给出满足条件的媒体流，若系统中的所有设备都不满足条件，则返回的 Promise 会被拒绝。

返回的 Promise 也可能永久处于待定（pending）状态，例如用户忽略授权提醒，注意这不会导致页面交互的阻塞。

## constraints 选项

`constraints`是一个选项对象，可以包含属性`audio`、`video`，分别代表音频和视频轨道的约束条件，默认值为`false`。除此之外，取值还可以是`true`或`MediaTrackConstraints`对象。

当取值为`true`时，浏览器通常会从系统设置或当前源设置的默认设备获取轨道。前面章节中出现的例子就属于这种用法。

至于使用`MediaTrackConstraints`对象来表示约束，我们先来看几个例子。

### constraints 示例

假设我们想获取只包含视频轨的流，分辨率优先选择 1280x720，那么可以像如下方式调用：

```javascript
getUserMedia({
  video: {
    width: 1280,
    height: 720,
  },
});
```

某些情况下，上述调用参数相当于：

```javascript
getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
});
```

对于用`ideal`指定的参数，浏览器会尽可能满足，如果无法满足，也会尝试其它尽可能接近的方案。

如果我们要求视频分辨率至少需要达到 640x480，可以用`min`来指定：

```javascript
getUserMedia({
  video: {
    width: { min: 640 },
    height: { min: 480 },
  },
});
```

也可以指定理想情况下的分辨率，如无法满足，在指定的范围内寻找硬件能支持的最接近的指标。通过`min`和`max`限定范围：

```javascript
getUserMedia({
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
  },
});
```

如我们希望获取精确指定的分辨率，如 1280x720，可以使用`exact`关键字：

```javascript
getUserMedia({
  video: {
    width: { exact: 1280 },
    height: { exact: 720 },
  },
});
```

对于移动设备，某些场景可能需要强制使用前置摄像头（例如视频会议、身份验证等），指定`facingMode`为`user`即可：

```javascript
getUserMedia({
  video: {
    facingMode: { exact: "user" },
  },
});
```

可以组合使用多个条件来增加约束，例如优先使用后置摄像头，分辨率至少 320x240：

```javascript
getUserMedia({
  video: {
    facingMode: { ideal: "environment" },
    width: { min: 320 },
    height: { min: 240 },
  },
});
```

通常在 UI 界面会允许用户在设备列表中（通过`enumerateDevices()`获取）选择要使用的设备，一旦用户做出选择，获得对应设备的`deviceId`后，可以按`deviceId`来获取媒体轨道：

```javascript
getUserMedia({
  video: {
    deviceId: { exact: "xxxxxxxx" },
  },
});
```

如需验证所获取的流是否满足条件，可以调用`MediaStreamTrack.getSettings()`查看当前轨道的设置：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: 320,
    height: 240,
  },
});
stream.getTracks()[0].getSettings(); /*
{
    "aspectRatio": 1.3333333333333333,
    "brightness": 128,
    "colorTemperature": 4000,
    "contrast": 128,
    "deviceId": "ea3ff7be276fe47df7a03f80edb081a71bc3f2f14ce1bd88dc568c555f679f16",
    "focusDistance": 0,
    "focusMode": "continuous",
    "frameRate": 30,
    "groupId": "fa6bdabb020c0cc2d3f6aa480aa870fa028e56ada1ac56933f1648bf9f383d8f",
    "height": 240,
    "resizeMode": "crop-and-scale",
    "saturation": 128,
    "sharpness": 128,
    "whiteBalanceMode": "continuous",
    "width": 320
}
*/
```

### constraints 语法

从上例中可以看到，每个参数都可以直接指定约束值，或用`ideal`指定约束值。浏览器尝试获取满足条件的媒体流，若无法满足，会寻找最接近匹配的方案。

如需指定精确匹配的条件，使用`exact`关键字来约束条件。

对于数值型约束，还可以指定`min`和`max`来限制所允许的取值范围。

### 常用音视频 constraints 约束

#### 通用约束

`deviceId`用于指定设备 ID，string 类型。

`groupId`用于指定设备所属组 ID，string 类型。

#### 音频轨约束

`autoGainControl`用于指定是否启用音频自动增益，boolean 类型，默认值为`true`，也即`{ideal:true}`。

`echoCancellation`用于指定是否启用音频回声消除，boolean 类型，默认值为`true`。对避免音频形成环路很有帮助。例如对着麦克风说话，声音又从音箱回放出来，再次进入麦克风形成循环；也可以是网络通话场景，对方接收到音频后回放出来，并再次通过对方的麦克风回到本地并播放出来，形成循环。

`noiseSuppression`用于指定是否启噪声抑制，即通常说的降噪，boolean 类型，默认值为`true`。

`channelCount`用于指定声道数，例如`1`为单声道，`2`为双声道。

`sampleRate`用于指定采样频率，数值类型，例如`48000`，即 48kHz。

`sampleSize`用于指定采样位数，即采样精度，数值类型，例如`16`，即每个声道单次采样精度为 16bit。

#### 视频轨约束

`width`用于指定分辨率宽度，数值类型。

`height`用于指定分辨率高度，数值类型。

`aspectRatio`用于指定宽高比，数值类型，对于 16:9 的视频而言，值为`1.7777777778`。

`resizeMode`指定浏览器从设备获取轨道原始采样后，使用何种调整方式以满足分辨率约束。设为`crop-and-scale`允许浏览器通过裁剪和缩放来调整分辨率；设为`none`表示不调整。

`frameRate`用于指定采样帧率，数值类型。

`facingMode`选择某种朝向的摄像头，可以是`user`朝向用户即前置，`environment`朝向周围环境即后置。如果设备支持，也可以设置`left`或`right`选择在用户左侧或右侧的摄像头。

## 示例：通过摄像头保存自拍照

现在，我们演示一下如何通过摄像头抓取一帧画面，并将其保存为图片，以此实现保存自拍照的功能。总体流程如下：

1. 调用`getuserMedia()`获取流
2. 在`HTMLVideoElement`上播放流
3. 点击按钮后，在 Offscreen Canvas Context 上调用`drawImage(video)`将当前一帧绘制到画布
4. 调用`canvas.convertToBlob()`转化为`Blob`对象
5. 创建超链接指向 Blob 并触发下载

页面基本 HTML 结构如下：

```html
<body>
  <video muted></video>
  <button>Download</button>
</body>
```

尝试获取视频流，采用竖屏模式，尽可能使用前置摄像头，然后用`video`来播放：

```javascript
const video = document.querySelector("video");

(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      aspectRatio: 9 / 16,
      facingMode: "user",
    },
  });
  video.srcObject = stream;
  await video.play();
})();
```

执行上述代码后，可以发现当摄像头正对人脸时，从屏幕观察到的水平方向和实际方向是相反的，例如伸出左手，在屏幕上可以看到手从右边伸出。一般应对这种情况的方案是使画面水平翻转，也就是镜像（mirror）模式，就好象在照镜子一样。我们使用 CSS 来水平翻转`video`元素：

```css
video {
  transform: scaleX(-1);
}
```

在`await video.play()`之后，可以得到视频轨实际的分辨率，用它来构造`OffscreenCanvas`：

```javascript
const width = video.videoWidth;
const height = video.videoHeight;

const canvas = new OffscreenCanvas(width, height);
const context = canvas.getContext("2d");
```

虽然通过 CSS 将`video`元素进行了水平翻转，但那只是视觉上的效果，调用`context.drawImage()`后得到的图像依然是翻转前的。为了解决该问题，我们需要对 Canvas 坐标系执行类似的翻转。由于翻转是以原点作为中心点的，翻转后 x 轴指向了 canvas 左方且在画布左边界之外，我们再通过平移坐标系将需要的宽度移动到可见区域内：

```javascript
context.scale(-1, 1);
context.translate(-width, 0);
```

当用户点击按钮时，就可以将视频帧绘制到 Canvas 上，导出并下载：

```javascript
const button = document.querySelector("button");
button.addEventListener("click", async () => {
  context.clearRect(0, 0, width, height);
  context.drawImage(video, 0, 0);
  const blob = await canvas.convertToBlob({ type: "image/png" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.download = "portrait.png";
  link.href = url;
  link.click();
});
```
