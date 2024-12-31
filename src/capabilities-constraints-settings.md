# Capabilities、Constraints 和 Settings

Capabilities 是浏览器或媒体硬件设备可以提供的某方面的能力，还会附带所支持的指标范围。例如对于麦克风，采样频率有一个支持的范围；摄像头受硬件所限，支持的分辨率也是一个有限的范围。

Constraints（约束）是我们在请求媒体轨道时，指定所期望的能力及其指标，浏览器将尽可能满足这些约束。在之前的章节中出现的`navigator.mediaDevices.getUserMedia()`调用中所传入的`audio`和`video`属性对象（非 boolean 值）即为约束。

Settings 是根据请求者所提供的 Constraints，最终获得的轨道的实际指标。

## 获取 InputDeviceInfo 的 Capabilities

通过`mediaDevices.enumerateDevices()`获得的设备列表，其中的输入设备（`kind`为`audioinput`或`videoinput`）为`InputDeviceInfo`接口。

可通过调用`inputDeviceInfo.getCapabilities()`获得某个设备的 Capabilities。

```javascript
const devices = await navigator.mediaDevices.enumerateDevices();
const camera = devices.find(d => d.kind === "videoinput");
camera.getCapabilities(); /*
{
    "aspectRatio": {
        "max": 2560,
        "min": 0.0006944444444444445
    },
    "deviceId": "ea3ff7be276fe47df7a03f80edb081a71bc3f2f14ce1bd88dc568c555f679f16",
    "facingMode": [],
    "frameRate": {
        "max": 30,
        "min": 1
    },
    "groupId": "2f7a0611aca123fc0106601ba80fc3e0cacb97d2e67cf768fdc30ad57194425c",
    "height": {
        "max": 1440,
        "min": 1
    },
    "resizeMode": [
        "none",
        "crop-and-scale"
    ],
    "width": {
        "max": 2560,
        "min": 1
    }
}
*/
```

从上例可以看出，当前系统的摄像头支持 2K 分辨率采样，最大帧率为 30。

## 检查浏览器支持的 Constraints

`mediaDevices.getSupportedConstraints()`方法返回浏览器支持的约束项。调用`getUserMedia()`或`getDisplayMedia()`时传入不支持的约束项，浏览器会静默忽略。`getSupportedConstraints()`方法返回的信息提供了约束的支持情况，所有类型（音频和视频）的媒体约束都会混合在一起。

```javascript
navigator.mediaDevices.getSupportedConstraints(); /*
{
    "aspectRatio": true,
    "autoGainControl": true,
    "brightness": true,
    "channelCount": true,
    "colorTemperature": true,
    "contrast": true,
    "deviceId": true,
    "displaySurface": true,
    "echoCancellation": true,
    "exposureCompensation": true,
    "exposureMode": true,
    "exposureTime": true,
    "facingMode": true,
    "focusDistance": true,
    "focusMode": true,
    "frameRate": true,
    "groupId": true,
    "height": true,
    "iso": true,
    "latency": true,
    "noiseSuppression": true,
    "pan": true,
    "pointsOfInterest": true,
    "resizeMode": true,
    "sampleRate": true,
    "sampleSize": true,
    "saturation": true,
    "sharpness": true,
    "suppressLocalAudioPlayback": true,
    "tilt": true,
    "torch": true,
    "voiceIsolation": true,
    "whiteBalanceMode": true,
    "width": true,
    "zoom": true
}
*/
```

## 获取 MediaStreamTrack 的 Capabilities

可通过`mediaStreamTrack.getCapabilities()`得到轨道对应设备的 Capabilities，方便后续调整 Constraints。

```javascript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const audioTrack = stream.getAudioTracks()[0];
audioTrack.getCapabilities(); /*
{
    "autoGainControl": [
        true,
        false
    ],
    "channelCount": {
        "max": 2,
        "min": 1
    },
    "deviceId": "default",
    "echoCancellation": [
        true,
        false
    ],
    "groupId": "74d7e3c7a9f43d956684714504d74e3533d49b65d60129da8515b1ed77dbcbaf",
    "latency": {
        "max": 0.021333,
        "min": 0.01
    },
    "noiseSuppression": [
        true,
        false
    ],
    "sampleRate": {
        "max": 48000,
        "min": 48000
    },
    "sampleSize": {
        "max": 16,
        "min": 16
    },
    "voiceIsolation": [
        true,
        false
    ]
}
 */
```

从上例可以看出，当前系统的麦克风最大支持双声道（`channelCount`为 2），但仅支持 48kHz 一种采样频率。

## 获取/应用 MediaStreamTrack 的 Constraints

可以从`mediaStreamTrack.getConstraints()`得到产生轨道时所用的约束，它是`MediaTrackConstraints`接口对象。

可以调用`mediaStreamTrack.applyConstraints()`使用新的约束来调整现有轨道：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: 640,
    height: 360,
  },
});
const videoTrack = stream.getVideoTracks()[0];
videoTrack.getConstraints(); /*
{
    "height": 360,
    "width": 640
}
*/

await videoTrack.applyConstraints({
  width: 1280,
  height: 720,
});
videoTrack.getConstraints(); /*
{
    "height": 720,
    "width": 1280
}
*/
```

## 获取 MediaStreamTrack 的 Settings

在获得了轨道之后，可以检查轨道当前实际使用的各项能力的指标。调用`mediaStreamTrack.getSettings()`来获得这些值。

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: 640,
    height: 360,
  },
});
const videoTrack = stream.getVideoTracks()[0];
videoTrack.getConstraints(); /*
{
    "height": 360,
    "width": 640
}
*/
videoTrack.getSettings(); /*
{
    "aspectRatio": 1.7777777777777777,
    "brightness": 128,
    "colorTemperature": 4000,
    "contrast": 128,
    "deviceId": "ea3ff7be276fe47df7a03f80edb081a71bc3f2f14ce1bd88dc568c555f679f16",
    "focusDistance": 0,
    "focusMode": "continuous",
    "frameRate": 30,
    "groupId": "6a784b6fd71f7b51d7388cb6db75e98ec8f18a5d0b486a73eefa0841eb834235",
    "height": 360,
    "resizeMode": "none",
    "saturation": 128,
    "sharpness": 128,
    "whiteBalanceMode": "continuous",
    "width": 640
}
*/

await videoTrack.applyConstraints({
  width: 1280,
  height: 720,
});
videoTrack.getConstraints(); /*
{
    "height": 720,
    "width": 1280
}
*/
videoTrack.getSettings(); /*
{
    "aspectRatio": 1.7777777777777777,
    "brightness": 128,
    "colorTemperature": 4000,
    "contrast": 128,
    "deviceId": "ea3ff7be276fe47df7a03f80edb081a71bc3f2f14ce1bd88dc568c555f679f16",
    "focusDistance": 0,
    "focusMode": "continuous",
    "frameRate": 30,
    "groupId": "6a784b6fd71f7b51d7388cb6db75e98ec8f18a5d0b486a73eefa0841eb834235",
    "height": 720,
    "resizeMode": "none",
    "saturation": 128,
    "sharpness": 128,
    "whiteBalanceMode": "continuous",
    "width": 1280
}
*/
```

在上例中，我们先请求了一个包含较小分辨率视频轨的流，通过`mediaStreamTrack.getSettings()`完成了验证。

随后我们通过`mediaStreamTrack.applyConstraints()`更新了该轨道的 Constrains，然后重新调用`mediaStreamTrack.getSettings()`，发现新的 Constraints 已经成功应用。
