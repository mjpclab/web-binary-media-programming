# MediaStream

`MediaStream`是用于包含`MediaStreamTrack`的容器。

## 获取包含的轨道

在之前的章节中，我们已经了解了获取`MediaStream`中 Track 的方法：`getTracks()`、`getAudioTracks()`和`getVideoTracks()`。

如果已知 MediaStreamTrack ID，可以调用`mediaStream.getTrackById(id)`来获取轨道：

```javascript
// const stream = ...
// const trackId = ...
const track = stream.getTrackById(trackId);
```

## MediaStream ID

MediaStream ID 是浏览器生成的 GUID 标识，它唯一地标识了一个媒体流，除了可以用于区分本地的多个流，也可用于标识远程流（例如在视频会议中的远端用户的音视频流）。

只读属性`id`用于获取 MediaStream ID，返回以字符串形式表示的 GUID。

```javascript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
stream.id; // xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## 活跃状态

`MediaStream`的只读属性`active`用于表示其是否活跃，依据是它是否至少包含一条尚未终止的`MediaStreamTrack`，即该 Track 的`readyState`属性不为`ended`。

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});
const audioTrack = stream.getAudioTracks()[0];
const videoTrack = stream.getVideoTracks()[0];

stream.active; // true

audioTrack.readyState; // 'live'
audioTrack.stop();
audioTrack.readyState; // 'ended'
stream.active; // true

videoTrack.readyState; // 'live'
videoTrack.stop();
videoTrack.readyState; // 'ended'
stream.active; // false
```

## 克隆 MediaStream

`mediaStream.clone()`方法会克隆`MediaStream`及其包含的`MediaStreamTrack`，产生新的 ID：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});

stream.id;
// 'a101d265-4ee3-4893-96b9-871416244b4f'
stream.getTracks().map(track => track.id);
// ['5823ead0-7bd5-4259-b38d-010384909e1b', 'be7458ba-9d9c-4b62-aaae-dcfb7ae02a5d']

const cloned = stream.clone();
cloned.id;
// '4dc9d6d5-974e-4253-bf40-7b456b92f909'
cloned.getTracks().map(track => track.id);
// ['9281a4a4-f60b-440b-889f-af2a1ab7eeac', 'c906c4b0-faec-4c48-a9c2-2d29e6048898']
```

## 创建 MediaStream

除了通过`getUserMedia()`等方法返回`MediaStream`，也可以手动创建，语法：

```javascript
new MediaStream();
new MediaStream(stream);
new MediaStream(tracks);
```

当使用无参方式调用`MediaStream()`构造函数，创建出的实例`active`为`false`，且内部不包含`MediaStreamTrack`：

```javascript
const stream = new MediaStream();
stream.active; // false
stream.getTracks(); // []
```

使用`new MediaStream(stream)`的方式创建的实例会和原实例共享`MediaStreamTrack`。新创建的 Stream 会有不同的 ID，但和`mediaStream.clone()`方法不同，它会和原始 Stream 共享轨道对象：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});

stream.id;
// '94510561-11bb-4923-9c05-aa6411b3c0cd'
stream.getTracks().map(track => track.id);
// ['e1b113d4-28d5-497d-a1a6-6ac4441c204d', 'c3eece8c-d119-42bb-8f7c-d3ed561405d3']

const shared = new MediaStream(stream);
shared.id;
// '8d39c304-f14a-4204-8ee1-969b8e3468a8'
shared.getTracks().map(track => track.id);
// ['e1b113d4-28d5-497d-a1a6-6ac4441c204d', 'c3eece8c-d119-42bb-8f7c-d3ed561405d3']

shared.getTracks().every((track, i) => track === stream.getTracks()[i]);
// true
```

使用`new MediaStream(tracks)`的方式创建的实例会将传入的`MediaStreamTrack`加入到新创建的`MediaStream`中：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});
const audioTracks = stream.getAudioTracks();

const audioOnlyStream = new MediaStream(audioTracks);
audioOnlyStream.getTracks().every((track, i) => track === audioTracks[i]);
// true
```

## 添加轨道（MediaStreamTrack）

`mediaStream.addTrack(track)`可以将现有的轨道添加到 Stream 中，如轨道已经在 Stream 中，则不会产生效果。

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
stream.getTracks(); // [MediaStreamTrack]

const videoStream = await navigator.mediaDevices.getUserMedia({
  video: true,
});
const videoTrack = videoStream.getVideoTracks()[0];

stream.addTrack(videoTrack);
stream.getTracks(); // [MediaStreamTrack, MediaStreamTrack]
```

对于一个`avtive`为`false`的`MediaStream`，在添加了一个未终止的轨道后，`active`会变为`true`：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});
stream.active; // true

stream.getTracks().forEach(track => track.stop());
stream.active; // false

const canvas = document.createElement("canvas");
const canvasStream = canvas.captureStream();
const canvasTrack = canvasStream.getVideoTracks()[0];
stream.addTrack(canvasTrack);
stream.active; // true
```

## 移除轨道（MediaStreamTrack）

`mediaStream.removeTrack(track)`可以从现有 Stream 中移除一个轨道。当剩余的轨道都已终止时，Stream 的`active`属性值会变成`false`。

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});
stream.getTracks().map(track => track.kind); // ['audio', 'video']

stream.getAudioTracks().forEach(track => track.stop());
stream.active; // true

const videoTrack = stream.getVideoTracks()[0];
stream.removeTrack(videoTrack);
stream.getTracks().map(track => track.kind); // ['audio']
stream.active; // false
```
