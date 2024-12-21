# MediaDevices

`MediaDevices`是操作媒体输入流的入口，其实例位于`navigator.mediaDevices`，它包含了一系列的方法。

由于操作媒体设备可以采集用户系统周边的各种环境信息，因而其受到隐私保护策略的严格约束。具体来说，这些方法只在当前域名为`localhost`或以`https:`协议访问时才可用，且需要获得用户授权（用户可以选择记住已授权信息）。
