# ImageData

ImageData 代表 Canvas 上某部分区域的底层像素数据，其内部以 Uint8ClampedArray 对象表示像素数据，排列格式为从图像左上角开始从左往右为一行，一直遍历所有行的每个像素，单个像素的色彩用 RGBA 共 4 个字节表示。所以 ImageData 中的像素数据就是不断重复的 RGBA，第 1 ～ 4 个字节表示第 1 个像素，第 5 ～ 8 个字节表示第 2 个像素，以此类推。

## 创建 ImageData

### 通过构造函数创建

语法：

```javascript
new ImageData(width, height);
new ImageData(width, height, settings);

new ImageData(dataArray, width);
new ImageData(dataArray, width, height);
new ImageData(dataArray, width, height, settings);
```

`width`和`height`指定了 ImageData 图像的宽高。

`dataArray`是一个`Uint8ClampedArray`对象，用于初始化像素数据，其值会被拷贝到 ImageData 内部维护的另一个 Uint8ClampedArray 对象，可通过实例属性`data`进行访问。如未提供`dataArray`或其长度小于用于表示图像所需的长度，默认像素值为 RGBA(0,0,0,0)。

### 通过 `Context.createImageData()`方法创建

创建空白透明图像（RGBA(0,0,0,0)）的 ImageData，语法：

```javascript
context.createImageData(width, height);
context.createImageData(width, height, settings);
context.createImageData(imagedata);
```

其中`imagedata`为已有的 ImageData 对象，仅会从中提取宽高信息而不会复制其中的像素数据。

### 通过 `context.getImageData()`方法创建

从已绘制图像的`CanvasRenderingContext2D`上提取 ImageData，语法：

```javascript
context.getImageData(sx, sy, sw, sh);
context.getImageData(sx, sy, sw, sh, settings);
```

## 其他 ImageData 操作

除了`context.getImageData()`，最常用的就是对应的`context.putImageData()`方法了，它可以把 ImageData 中的像素绘制到 Canvas 上。

语法：

```javascript
context.putImageData(imageData, dx, dy);
context.putImageData(imageData, dx, dy, sx, sy, w, h);
```

## 实例属性

只读属性`width`和`height`表示 ImageData 图像的宽高。

只读属性`data`为 ImageData 的底层像素数据，它是一个 Uint8ClampedArray 对象，以连续的 RGBA 字节序列表示像素。
