# MediaStreamTrack

`MediaStreamTrack`表示实际的媒体轨道，例如音频轨道或视频轨道。`MediaStreamTrack`无法直接播放，而是需要存在于`MediaStream`中。

让我们观察一些 MediaStreamTrack 上的一些属性：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});
const audioTrack = stream.getAudioTracks()[0];
const videoTrack = stream.getVideoTracks()[0];

audioTrack; /*
{
    enabled: true;
    id: "278ab27f-4ad7-4816-b6fe-1fb0bbbd1ec5";
    kind: "audio";
    label: "Default";
    muted: false;
    readyState: "live";
}
*/

videoTrack; /*
{
    id: "386c4e4e-a46c-4bc1-a5f2-852a517a242f";
    kind: "video";
    label: "4K USB Camera: 4K USB Camera (2bdf:028b)";
    muted: false;
    readyState: "live";
}
*/
```

## MediaStreamTrack ID

MediaStreamTrack ID 是浏览器生成的 GUID 标识，它唯一地标识了一个媒体轨道，除了可以用于区分本地的多个轨道，也可用于标识远程轨道（例如在视频会议中的远端用户的音频或视频轨道）。

只读属性`id`用于获取 MediaStreamTrack ID，返回以字符串形式表示的 GUID。

## 媒体类型

只读属性`kind`用于表示轨道的媒体类型，`audio`代表音频，`video`代表视频。

## 描述性信息

只读属性`label`用于表示该轨道的一般性描述，方便用户或开发调试时识别。

## 启用/停用输出渲染

属性`enabled`用于设置该轨道是否启用输出或渲染。

## 就绪状态

可以通过只读属性`readyState`获取轨道就绪状态，`live`表示当前已连接到有效的输入源，并提供实时数据；`ended`表示轨道已终止，不会再有更多的数据到达。

在`live`状态的`MediaStreamTrack`上调用`.stop()`方法会导致其状态变为`ended`。

```javascript
// 创建一个video元素
const video = document.createElement("video");
video.muted = true;
document.body.append(video);

// 创建一个视频流并在video上播放
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
});
video.srcObject = stream;
video.play();

// 获取视频轨道
const videoTrack = stream.getVideoTracks()[0];

// 禁用轨道，画面变黑屏
videoTrack.enabled = false;
// 重新启用轨道
videoTrack.enabled = true;

// 停止轨道，画面变黑屏，将不能再恢复播放
videoTrack.readyState; // live
videoTrack.stop();
videoTrack.readyState; // ended
```

## 克隆 MediaStreamTrack

`clone()`方法克隆一个已有的 MediaStreamTrack，产生的新 MediaStreamTrack 有一个与原轨道不同的`id`属性值。
