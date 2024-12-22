# getDisplayMedia()方法

`getDisplayMedia()`用于将桌面或窗口录制成`MediaStream`流，一般用于在视频会议中分享屏幕内容。

`getDisplayMedia()`用法与`getUserMedia()`相似，在使用时可以传入可选的选项对象用于媒体轨道的约束：

```javascript
getDisplayMedia([options]);
```

调用`getDisplayMedia()`后，浏览器将弹出界面询问用户要分享的内容，例如整个屏幕、指定的应用程序窗口或浏览器 Tab 页。

```javascript
const stream = await navigator.mediaDevices.getDisplayMedia({
  audio: true,
  video: { width: 1280, height: 720 },
});

const video = document.createElement("video");
video.muted = true;
video.srcObject = stream;
video.play();
document.body.append(video);
```
