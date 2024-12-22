# getSupportedConstraints()方法

`getSupportedConstraints()`方法返回浏览器支持的约束选项。调用`getUserMedia()`或`getDisplayMedia()`时传入不支持的约束选项，浏览器会静默忽略。可以通过调用`getSupportedConstraints()`方法返回的信息来了解支持情况。

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
