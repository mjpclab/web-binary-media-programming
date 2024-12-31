# enumerateDevices()方法

在上一节中，通过传递`{audio:true, video:true}`参数，向浏览器请求由音频轨和视频轨组成的媒体流：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});
```

如果读者仔细思考这种调用方式，一定会产生一个疑问：假如系统有多个音视频输入设备（麦克风、摄像头，无论是内置还是外接的），那么浏览器到底会选择从哪个设备提取媒体轨道呢？如何从某个指定的设备获取轨道呢？

本节我们先了解`enumerateDevices()`方法，而下一节将给出上述两个问题的答案。

由于不同系统的媒体输入设备都不尽相同，想要从指定的设备获取媒体轨道，首先需要知道当前系统有哪些可用的设备，即一个设备的列表，以便用户可以从中选择或切换。`enumerateDevices()`正是用于此目的，它请求枚举系统中可用的设备。假设系统中已经连接了麦克风和摄像头设备：

```javascript
const devices = await navigator.mediaDevices.enumerateDevices();
devices; /*
[
    {
        "deviceId": "",
        "kind": "audioinput",
        "label": "",
        "groupId": ""
    },
    {
        "deviceId": "",
        "kind": "videoinput",
        "label": "",
        "groupId": ""
    },
    {
        "deviceId": "",
        "kind": "audiooutput",
        "label": "",
        "groupId": ""
    }
]
*/
```

看上去似乎没有太多有用的信息。实际上，如果从未在页面所在源通过`getUserMedia()`请求过音视频对应类型的轨道，那么该种类型设备就不会被枚举出来，这是出于隐私安全的考虑，我们需要至少请求过某种类型设备一次，并获得用户授权，才能枚举出该类设备：

```javascript
// 等待用户授权并resolve Promise
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
// 成功后关闭这些输入流
stream.getTracks().forEach(track => track.stop());

const devices = await navigator.mediaDevices.enumerateDevices();
devices; /*
[
    {
        "deviceId": "default",
        "kind": "audioinput",
        "label": "Default",
        "groupId": "b45db9a3bcd8e0b65a195cb0ac290b567a8e3895cdf41cd8231fb56ba30471c7"
    },
    {
        "deviceId": "62735ee33a2217066dd9722a2584c4798b0020fa782b2bd025d30b74c55dc858",
        "kind": "audioinput",
        "label": "Built-in Audio Analog Stereo",
        "groupId": "9cebb10d75818046df46c88ffc26a8d35da76647a1b4e0dfc29899fe2315da09"
    },
    {
        "deviceId": "f973b90732092060423a606afbd213de016f13483ea7119bc9271d698e0cf268",
        "kind": "audioinput",
        "label": "4K USB Camera Analog Stereo",
        "groupId": "fcf3eb2ecc2d13cb28da9180390d4699ca5743be9f068e8838a962370d3368a5"
    },
    {
        "deviceId": "",
        "kind": "videoinput",
        "label": "",
        "groupId": ""
    },
    {
        "deviceId": "default",
        "kind": "audiooutput",
        "label": "Default",
        "groupId": "default"
    },
    {
        "deviceId": "16835a3fb7a6f808f8a5f91ad3dec268b4cbac1aaa0aa557198f11fcbed7ae9f",
        "kind": "audiooutput",
        "label": "Built-in Audio Analog Stereo",
        "groupId": "9cebb10d75818046df46c88ffc26a8d35da76647a1b4e0dfc29899fe2315da09"
    }
]
*/
```

可以看到，`kind`属性为`audiointput`的麦克风设备现在已经可以被枚举出来了，运行结果因系统所配置的设备不同而不同。

一般而言，在枚举设备前，都会先同时请求音频和视频权限，上例中只请求音频设备的情况并不常见：

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});
stream.getTracks().forEach(track => track.stop());

const devices = await navigator.mediaDevices.enumerateDevices();
devices; /*
[
    {
        "deviceId": "default",
        "kind": "audioinput",
        "label": "Default",
        "groupId": "b45db9a3bcd8e0b65a195cb0ac290b567a8e3895cdf41cd8231fb56ba30471c7"
    },
    {
        "deviceId": "62735ee33a2217066dd9722a2584c4798b0020fa782b2bd025d30b74c55dc858",
        "kind": "audioinput",
        "label": "Built-in Audio Analog Stereo",
        "groupId": "9cebb10d75818046df46c88ffc26a8d35da76647a1b4e0dfc29899fe2315da09"
    },
    {
        "deviceId": "f973b90732092060423a606afbd213de016f13483ea7119bc9271d698e0cf268",
        "kind": "audioinput",
        "label": "4K USB Camera Analog Stereo",
        "groupId": "fcf3eb2ecc2d13cb28da9180390d4699ca5743be9f068e8838a962370d3368a5"
    },
    {
        "deviceId": "ea3ff7be276fe47df7a03f80edb081a71bc3f2f14ce1bd88dc568c555f679f16",
        "kind": "videoinput",
        "label": "4K USB Camera: 4K USB Camera (2bdf:028b)",
        "groupId": "2cd5ef99e616c0e4a87d7b3d3e29b0fc097c3dd42fa8a293e4e4e440b766155a"
    },
    {
        "deviceId": "default",
        "kind": "audiooutput",
        "label": "Default",
        "groupId": "default"
    },
    {
        "deviceId": "16835a3fb7a6f808f8a5f91ad3dec268b4cbac1aaa0aa557198f11fcbed7ae9f",
        "kind": "audiooutput",
        "label": "Built-in Audio Analog Stereo",
        "groupId": "9cebb10d75818046df46c88ffc26a8d35da76647a1b4e0dfc29899fe2315da09"
    }
]
*/
```

## MediaDeviceInfo 接口

`enumerateDevices()`方法返回的列表中的每一个元素都是一个`MediaDeviceInfo`接口。

`deviceId`是其中最重要的属性，顾名思义，它用于表示设备的唯一性，而下一节要介绍的获取指定设备的媒体轨道，也是通过指定这个属性实现的。`deviceId`很特殊，虽然它能唯一地标识出某个设备，但是在不同的源下，同一设备所对应的`deviceId`也会不同，这是出于隐私安全考虑，防止根据用户指纹跨源追踪用户。即便是同一个源，如果用户主动清除了该源下浏览器保存的数据，那么下次再枚举设备时，也会得到一个全新的`deviceId`。

`kind`用于表示设备种类，`audioinput`代表音频输入设备，即麦克风；`videoinput`代表视频输入设备，即摄像头；而`audiooutput`为音频输出设备，例如耳机或音箱。

`groupId`用于标识物理设备分组，如果两个设备属于同一物理设备，它们会有相同的`groupId`。例如很多摄像头同时也集成了麦克风，封装在同一个外壳中，它们通常会有相同的`groupId`。

`label`是关于设备的描述性信息，方便用户识别。

## 关于 `deviceId` 为 `default` 的设备

在基于 Chromium 的浏览器中，枚举设备时会得到一个`deviceId`为`default`、`label
`为`Default`的设备，它是指系统默认设备，取决于操作系统级别的设置，当设置改变时，`default`所指向的设备也会跟着变化。

而在其它浏览器中，一般会将默认设备所对应的名称直接显示出来作为`label`，并生成一个和正常设备格式相同的`deviceId`。

## InputDeviceInfo 接口

`InputDeviceInfo`继承自`MediaDeviceInfo`，针对数据输入型设备作了扩展。输入型设备即`mediaDeviceInfo.kind`为`audioinput`和`videoinput`的设备。

`inputDeviceInfo.getCapabilities()`返回设备所能支持的工作指标范围，为`MediaTrackCapabilities`接口，例如针对上例中返回的摄像头设备：

```javascript
devices[3].getCapabilities(); /*
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
    "groupId": "e64e7fcce1719cd7f379aad1f70c7d64e15ec39095f578d3eb2de01dc033a030",
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

## 订阅设备列表变更通知

假设有一个供用户选择要使用的媒体设备的列表，自然很希望当用户在插拔这些设备时，列表可以自动更新。比较高效的做法自然是期望在系统设备在发生变化时，能获得通知。

`devicechange`事件正是我们所需要的通知事件，该事件的触发代表着设备列表的变化，可能是增加了新设备，也可能是移除了现有设备。

```javascript
let devices = await navigator.mediaDevices.enumerateDevices();
navigator.mediaDevices.addEventListener("devicechange", async () => {
  devices = await navigator.mediaDevices.enumerateDevices();
});
```
