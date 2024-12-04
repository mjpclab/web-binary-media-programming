# Canvas 及其 Context

在 HTML5 中，Canvas 是用于展现图形绘制结果的容器，它包含少量的方法用于将绘制的图像导出到其他二进制格式，比如 Blob 或 Data URL 等。

除了常用的`HTMLCanvasElement`（`<canvas>`元素实例），比较常用的还有`OffscreenCanvas`，它不会在屏幕上显示，同时解耦了与 DOM 的交互，因而可以运行在 Worker 线程中，使得在执行较复杂的图形任务时不会阻塞主线程。

主要的图形绘制接口并不在 Canvas 上，而是通过使用被称为 Context 的对象实现的。一个 Canvas 可以创建一个对应的 Context。Context 种类有很多，本书只讨论用于二维平面图形绘制的 Context。

获取 Context 对象的方法很简单：

```javascript
// 获取一个 2D Context 对象
const context = canvas.getContext("2d");
```

对于`HTMLCanvasElement`，调用`getContext("2d")`方法返回`CanvasRenderingContext2D`，而在`OffscreenCanvas`上调用则返回`OffscreenCanvasRenderingContext2D`。
