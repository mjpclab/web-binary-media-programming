# ImageBitmap

`ImageBitmap`代表图像的位图信息，用于在 canvas 上低延迟地绘制其图像（例如`Context.drawImage(imageBitmap, ...)`）。

## 创建 ImageBitmap

### 通过全局函数`createImageBitmap()`创建

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

之后可提供 4 个参数，以从源图像裁切，分别是裁切起始点的 x、y 坐标和宽高（可以为负数，表示反方向框选）。

`options`对象上可以设置额外的选项。如要对图像进行缩放，`resizeWidth`设置最终图像的宽度，`resizeHeight`设置最终图像的高度，`resizeQuality`设置缩放质量（`pixelated`、`low`、`medium`或`high`）；`imageOrientation`可根据原始图像的 EXIF 信息调整翻转，可设置为`from-image`、`flipY`或`none`。

### 通过`OffscreenCanvas.transferToImageBitmap()`创建

可以通过`OffscreenCanvas`实例的`transferToImageBitmap()`方法快速创建 ImageBitmap。

```javascript
// 创建OffscreenCanvas并导出ImageBitmap
const osCanvas = new OffscreenCanvas(100, 100);
const osContext = osCanvas.getContext("2d");
osContext.strokeRect(10, 10, 80, 80);
const bitmap = osCanvas.transferToImageBitmap();

// 将ImageBitmap绘制到另一HTMLCanvasElement
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
context.drawImage(bitmap, 0, 0);
document.body.append(canvas);
bitmap.close();
```

## 属性和方法

ImageBitmap 的`width`和`height`属性用于获取图像（缩放后）的宽和高，它们都是只读的。

当 ImageBitmap 不再使用时，可调用`close()`方法释放资源。

## 示例：裁剪并缩放图片

我们将演示如何裁剪并缩放图片。例子简单地将用户选择的图片裁剪出正中心部分，宽高为原始图片的一半，然后再重新缩放到原始图片的大小。

先准备必要的 HTML 标签：

```html
<input id="fileinput" type="file" accept="image/*" />
<img id="preview" />
<a id="download" download>Download</a>
```

当用户选择了图片文件，触发裁剪和缩放流程：

```javascript
fileinput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    onFileUpdate(file);
  }
});
```

具体的裁剪和缩放处理实现在`onFileUpdate(file)`中：

```javascript
const onFileUpdate = async file => {
  let bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap = await createImageBitmap(
    bitmap,
    width / 4,
    height / 4,
    width / 2,
    height / 2,
    {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "medium",
    }
  );

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  canvas.toBlob(blob => {
    const blobUrl = URL.createObjectURL(blob);
    preview.src = blobUrl;
    download.href = blobUrl;
  });
};
```

首先通过`file`对象，它创建出初始的`ImageBitmap`对象，有了它就可以得知原始图片的尺寸，我们将其保存的`width`和`height`变量中。

接着我们根据初始 ImageBitmap 对象创建新的 ImageBitmap，其相对于初始对象的裁剪起点为`width/4`和`height/4`，而裁剪长度为`width/2`和`height/2`，刚好是初始图像正中间部分，大小为原先的一半。在选项对象中，我们又通过`resizeWidth`和`resizeHeight`指定缩放后的大小为原始图像的大小。

为了能显示并下载裁剪后的图片，我们需要将 ImageBitmap 转换成指向 Blob 的 Object URL，而要达到此目的，又需要先把 ImageBitmap 绘制到 canvas 元素上，然后通过 HTMLCanvasElement 的方法转换成 Blob。
