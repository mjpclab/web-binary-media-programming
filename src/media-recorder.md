# MediaRecorder

如果要把`MediaStream`录制成音频或视频文件，可以使用`MediaRecorder`。

必须在要开始录制的时间点启动`MediaRecorder`的录制功能，并在需要结束录制的时间点停止录制。

## 示例：自拍视频录像工具

让我们先从一个简单的例子开始，看看如何制作一个简易的自拍视频录像工具。

页面包含一个用于预览的 video 元素，两个分别用于启动和停止录制的操作按钮，以及用于包含录制历史文件的列表：

```html
<video muted playsinline></video>
<button disabled>Start</button>
<button disabled>Stop</button>
<ul></ul>
```

```javascript
const video = document.querySelector("video");
const [btnStart, btnStop] = document.querySelectorAll("button");
const list = document.querySelector("ul");
```

获取音视频流，并在 video 元素上预览视频：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: { facingMode: "user" },
});
video.srcObject = stream;
video.play();
```

准备一个分块数据缓冲区，然后创建`MediaRecorder`，并订阅`dataavailable`事件。每当触发`dataavailable`事件，将新的数据块（Blob 对象）添加到分块缓冲区末尾：

```javascript
let chunks = [];
const recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
recorder.addEventListener("dataavailable", e => {
  chunks.push(e.data);
});
```

当`MediaRecorder`触发`stop`事件时，代表录制已经完全停止，此时我们收集到了完整的分块，将它们组装成一个大的 Blob，并重新初始化分块数据缓冲区以供下次录制使用，然后生成链接供预览或下载：

```javascript
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
```

最后监听按钮事件以允许用户控制录制过程：

```javascript
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
```

## 创建 MediaRecorder

语法：

```javascript
new MediaRecorder(stream);
new MediaRecorder(stream, options);
```

`stream`为将要被录制的`MediaStream`。

可选的`options`对象上可以指定多个可选属性。

`mimeType`用于指定录制的封装格式 MIME 类型，例如`video/mp4`，还可附带内部媒体流的编解码器格式，例如`video/mp4; codecs=vp9,opus`。可以调用静态方法`MediaRecorder.isTypeSupported(mimeType)`检查浏览器是否支持该 MIME 类型。

`audioBitsPerSecond`指定音频码率。

`videoBitsPerSecond`指定视频码率。

`bitsPerSecond`指定音视频整体码率。

### 录制状态

`mediaRecorder.state`属性表示当前录制状态：

- `inactive`：非活动状态，尚未开始录制，或在录制过程中调用`mediaRecorder.stop()`停止录制后进入该状态
- `recording`：正在录制并捕获数据，通过调用`mediaRecorder.start()`进入该状态
- `paused`：当前处于录制暂停状态，在录制过程中调用`mediaRecorder.pause()`进入该状态

### 录制流程控制

在创建`MediaRecorder`实例后，一般按如下流程运行：

1. 订阅`dataavailable`事件，每当有新数据分块到来时会触发，需要收集所有的分块才能合成最终的视频。
2. 订阅`stop`事件，在录制停止后，最后一个分块的`dataavailable`事件处理程序完成后触发。此时可以将收集到的所有分块合成一个大的单一的 Blob 文件。
3. 启动录制，调用`mediaRecorder.start([timeslice])`，可选参数`timeslice`表示每个分块的时长，到达时长后触发`dataavailable`事件将当前分块交给事件处理程序处理。
4. 录制过程中可以暂停，处于暂停时段的媒体不会被录制。调用`mediaRecorder.pause()`暂停录制，调用`mediaRecorder.resume()`恢复录制。
5. 到达录制目标的结束时间点后，调用`mediaRecorder.stop()`停止录制。

随着控制流程的变化，`MediaRecorder`的状态也在发生变化，同时会触发对应的事件来进行通知：

- `start`事件：调用`mediaRecorder.start()`启动录制后触发
- `stop`事件：调用`mediaRecorder.stop()`停止录制或录制源`MediaStream`终止后，处理完最后一个分块的`dataavailable`事件后触发。
- `pause`事件：在录制过程中调用`mediaRecorder.pause()`暂停录制后触发
- `resume`事件：在暂停录制后调用`mediaRecorder.resume()`恢复录制后触发

让我们在上例的基础上增加一些代码，观察`MediaRecorder`状态的变化。

先增加暂停录制的机制，我们通过双击页面空白处来暂停和恢复：

```javascript
document.body.addEventListener("dblclick", () => {
  if (recorder.state === "recording") {
    recorder.pause();
  } else if (recorder.state === "paused") {
    recorder.resume();
  }
});
```

然后监听状态变化事件，并打印当前的`state`：

```javascript
console.log("state:", recorder.state);
function onEventFired(e) {
  console.log(`event: ${e.type}, state: ${this.state}`);
}
recorder.addEventListener("start", onEventFired);
recorder.addEventListener("stop", onEventFired);
recorder.addEventListener("pause", onEventFired);
recorder.addEventListener("resume", onEventFired);
```

如果我们打开页面，按录制 → 暂停 → 恢复 → 停止的步骤操作，可以在控制台中看到如下日志：

```
state: inactive
event: start, state: recording
event: pause, state: paused
event: resume, state: recording
event: stop, state: inactive
```

### 关于数据分块

有两种情况会导致录制数据分成多快，从而导致不止一次地触发`dataavailable`事件。

在调用`mediaRecorder.start(timeslice)`指定`timeslice`启动录制后，每隔 timeslice 毫秒都会产生一个新的分块。

调用`mediaRecorder.requestData()`会立即提交分块，触发`dataavailable`事件，并开始一个新的分块。

这两种情况也可以同时存在，即在启动时指定了 timeslice，在还未到达下次提交的时间点时，调用`mediaRecorder.requestData()`临时产生新的分块。

### 录制音频

`MediaRecorder`也可以录制纯音频，只要`MediaStream`中只包含音频轨即可。同样，其实也可以录制无声视频，只要`MediaStream`中只包含视频轨即可。

以录制音频为例，先获取纯音频流，然后再创建`MediaRecorder`，如要指定`mimeType`，应该提供音频封装格式：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
const recorder = new MediaRecorder(stream, { mimeType: "audio/mp4" });
```
