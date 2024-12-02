# ImageBitmap

`ImageBitmap`代表图像的位图信息，用于在 canvas 上低延迟地绘制其图像。

## 创建 ImageBitmap

通过全局函数`createImageBitmap()`产生`Promise<ImageBitmap>` 实例，语法：

```javascript
createImageBitmap(image);
createImageBitmap(image, options);
createImageBitmap(image, sx, sy, sw, sh);
createImageBitmap(image, sx, sy, sw, sh, options);
```

`image`为图片来源，它可以是多种图像媒介：

- HTMLImageElement（即`<img>`元素实例）
- HTMLVideoElement（即`<video>`元素实例）
- HTMLCanvasElement（即`<canvas>`元素实例）
- OffscreenCanvas
- Blob
- ImageData
- ImageBitmap

之后可提供 4 个参数，以从源图像裁切，分别是裁切起始点的 x、y 坐标和长宽（可以为负数，表示反方向框选）。

`options`对象上可以设置额外的选项。如要对图像进行缩放，`resizeWidth`设置输出图像的宽度，`resizeHeight`设置输出图像的高度，`resizeQuality`设置缩放质量（`pixelated`、`low`、`medium`或`high`）。

## 属性和方法

ImageBitmap 的`width`和`height`属性用于获取图像（缩放后）的宽和高，它们都是只读的。

当 ImageBitmap 不再使用时，可调用`close()`方法释放资源。
