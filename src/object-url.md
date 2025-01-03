# Object URL

有些 HTML 元素会读取网络资源并以特定方式来展示，如`<img>`元素通过`src`属性获取指定资源，并在屏幕上显示图片内容；`<a>`元素通过`href`属性指向一个 URL 资源，点击后会访问该资源；`<audio>`和`<video>`元素通过`src`属性或`<source>`子元素指向某个媒体文件等。

如果在`Blob`对象中存储了某项资源的二进制数据，想要通过相应的 HTML 元素来展示，那么需要有一个桥梁，可以衔接这些 HTML 元素的 URL 属性和 Blob 对象。通过创建 Object URL，并赋给这些 HTML 元素的 URL 属性，可以实现这一目标。

使用`URL.createObjectURL(blob)`可以得到一个内部指向 Blob 数据的、以字符串形式表示的特殊 URL，通常以`blob:`开头。

Object URL 在当前页面的生命周期中有效，它可以在单独的标签页中被访问，也可以赋值到 HTML 元素的 URL 属性，例如`<img>`的`src`属性。

当 Object URL 不再使用时，可以调用`URL.revokeObjectURL(objectURL)`来释放资源。

下面我们通过代码创建一张图片的 Blob，并显示出来：

```javascript
// 创建用16进制序列表示的图片
// 数据通过Linux命令行将图片文件输出为16进制序列得到：
// od -An -t x1 image.webp | sed -e 's/ /,0x/g'
const imageData = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0xda, 0x03, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56,
  0x50, 0x38, 0x20, 0xce, 0x03, 0x00, 0x00, 0x30, 0x16, 0x00, 0x9d, 0x01, 0x2a,
  0x42, 0x00, 0x29, 0x00, 0x3e, 0x91, 0x40, 0x98, 0x4a, 0xa5, 0xa3, 0xa2, 0x21,
  0xa8, 0x94, 0x0b, 0xa0, 0xb0, 0x12, 0x09, 0x64, 0x00, 0xad, 0x9c, 0x56, 0x32,
  0xac, 0xe9, 0x67, 0xa5, 0x24, 0x0f, 0xe8, 0x1e, 0xa2, 0x7f, 0xf2, 0xe2, 0x43,
  0x7f, 0x9e, 0xfd, 0x80, 0xe0, 0x0b, 0xff, 0x55, 0xec, 0x41, 0xe8, 0x01, 0xfa,
  0xcd, 0xeb, 0x93, 0xea, 0xf5, 0xfe, 0xd2, 0xc0, 0x2b, 0xea, 0x5f, 0x8d, 0x3d,
  0x0d, 0x4f, 0x24, 0xf6, 0xcd, 0x7c, 0xce, 0xe2, 0x56, 0x48, 0x3f, 0xb8, 0xe4,
  0x9c, 0x7c, 0x9b, 0xfc, 0xb6, 0x91, 0x27, 0xfb, 0x4d, 0x62, 0x0f, 0xeb, 0x9f,
  0xef, 0x7d, 0x25, 0xff, 0xdc, 0xf3, 0x19, 0xf4, 0x4f, 0xb0, 0x47, 0xf2, 0xef,
  0xe9, 0xdf, 0xf4, 0x78, 0x1c, 0x18, 0x5e, 0xc0, 0xf8, 0x17, 0x68, 0xa4, 0xd8,
  0xab, 0x01, 0x28, 0xf2, 0x14, 0x2d, 0x4a, 0x01, 0x74, 0x2b, 0x24, 0x79, 0x90,
  0x77, 0x32, 0x0e, 0xf8, 0x2e, 0x5f, 0x90, 0x06, 0x2f, 0x70, 0x2a, 0x73, 0xd4,
  0xc1, 0xe4, 0x99, 0xb7, 0x56, 0x73, 0x36, 0xbf, 0x57, 0x0b, 0x6a, 0xaa, 0x62,
  0x84, 0xb4, 0xe0, 0x5c, 0xfa, 0xfa, 0xa8, 0x84, 0x25, 0x67, 0xf8, 0xf1, 0xa5,
  0x4e, 0x37, 0xfc, 0xae, 0x0f, 0x89, 0xc7, 0xd3, 0x95, 0x70, 0x80, 0x00, 0xfe,
  0xfd, 0x51, 0xe7, 0xfd, 0x80, 0x37, 0xf3, 0x59, 0xf9, 0x57, 0xf8, 0xa2, 0x3e,
  0x66, 0xa9, 0x87, 0x97, 0xa1, 0xd0, 0xf5, 0xbb, 0xba, 0xc8, 0x8b, 0xbb, 0x6f,
  0xea, 0xd6, 0x69, 0x22, 0x4a, 0x52, 0x41, 0xf8, 0xcc, 0x61, 0x64, 0xa8, 0x6d,
  0x00, 0x62, 0x69, 0xf1, 0x82, 0x8e, 0x37, 0xe4, 0xf8, 0x30, 0x79, 0x37, 0xba,
  0x1f, 0xe9, 0xdf, 0xed, 0xab, 0x74, 0x78, 0xc9, 0x68, 0xdb, 0xcc, 0xbd, 0xda,
  0xa3, 0xfd, 0xe4, 0x4b, 0xff, 0xf4, 0x7a, 0x48, 0x3f, 0xc6, 0xe1, 0x4f, 0xbd,
  0x1a, 0xe7, 0x4e, 0x0c, 0x87, 0xbd, 0x71, 0xa9, 0x33, 0x76, 0x3e, 0xb7, 0x1b,
  0xeb, 0x74, 0x1d, 0x68, 0x8a, 0x59, 0x17, 0xac, 0xda, 0xc5, 0xe7, 0xa9, 0x56,
  0x99, 0xce, 0xa7, 0x25, 0x91, 0xdd, 0xd8, 0x90, 0x16, 0xed, 0x6a, 0xb4, 0x53,
  0xb7, 0xee, 0xda, 0x8e, 0x6d, 0xd8, 0x03, 0xcb, 0x2b, 0x6c, 0x50, 0x07, 0x62,
  0xbe, 0x74, 0x75, 0x18, 0x14, 0x5a, 0x93, 0x3b, 0xfd, 0x74, 0x76, 0x9d, 0xd9,
  0x7e, 0x9c, 0x54, 0x2a, 0x20, 0xf9, 0x62, 0xae, 0x4e, 0x1e, 0x09, 0xeb, 0x5a,
  0xdd, 0x3a, 0x1c, 0x86, 0xff, 0xdd, 0xcb, 0x57, 0x96, 0x83, 0x0f, 0xab, 0xe9,
  0x90, 0xc6, 0xe0, 0xc4, 0x5b, 0x17, 0xd4, 0xb4, 0xff, 0x1f, 0xb2, 0xeb, 0xe5,
  0x36, 0xab, 0xda, 0x99, 0xd2, 0x2c, 0xb3, 0x78, 0xe4, 0xa6, 0x6c, 0x24, 0x87,
  0x0f, 0xfb, 0xd5, 0xd0, 0x05, 0x2f, 0xbc, 0x78, 0x2f, 0x2c, 0x72, 0xf4, 0xd3,
  0xa8, 0xd5, 0xfb, 0x08, 0x3b, 0x8a, 0xc7, 0xeb, 0x77, 0xf5, 0xf3, 0xbc, 0x7c,
  0x3b, 0x03, 0xea, 0x1c, 0x28, 0x86, 0x6a, 0xca, 0x5a, 0xd1, 0x93, 0xdd, 0xe1,
  0x33, 0x84, 0xb7, 0xd3, 0x32, 0x7a, 0xc5, 0x29, 0xf8, 0xae, 0x1d, 0x53, 0x46,
  0xfc, 0x1b, 0x94, 0x04, 0x0f, 0x86, 0xd2, 0xe7, 0xf9, 0x36, 0x50, 0x25, 0x41,
  0xbf, 0x4b, 0xf6, 0xee, 0x90, 0x04, 0x8d, 0x33, 0xb2, 0x64, 0xc9, 0x7d, 0x24,
  0xdb, 0x01, 0x82, 0x43, 0xa9, 0x36, 0x9e, 0x2f, 0xe3, 0x8a, 0x60, 0x63, 0x10,
  0x54, 0xaa, 0xf3, 0xe2, 0xed, 0x52, 0x8d, 0xa6, 0x6e, 0x31, 0xc6, 0x89, 0x7d,
  0x2d, 0xc7, 0x73, 0xa4, 0xc1, 0xf6, 0xf5, 0xdc, 0x5f, 0xef, 0x65, 0xfc, 0x09,
  0x9a, 0x70, 0xb4, 0x0c, 0xa2, 0xe8, 0x86, 0xd1, 0x95, 0x76, 0x4f, 0xbf, 0x0f,
  0x7b, 0x83, 0xfd, 0x4c, 0x9b, 0xcc, 0x66, 0xe3, 0xde, 0x15, 0x8f, 0xde, 0x99,
  0x81, 0x35, 0xeb, 0xd4, 0x2d, 0x18, 0x04, 0xc2, 0x84, 0x37, 0xe6, 0x32, 0x5c,
  0xbb, 0xae, 0x25, 0x43, 0x6f, 0x74, 0xb4, 0x1f, 0xfd, 0xb3, 0x5b, 0x0f, 0x7e,
  0x88, 0x8a, 0x46, 0xf4, 0xaf, 0x96, 0x2f, 0xf8, 0x61, 0x9f, 0x15, 0xa9, 0x05,
  0x23, 0x8e, 0x73, 0xbc, 0x77, 0xff, 0x12, 0x7c, 0x74, 0x09, 0x56, 0xb3, 0x8e,
  0x82, 0x68, 0x10, 0x11, 0xd9, 0x4b, 0xbc, 0xe8, 0x7a, 0x88, 0xe0, 0x84, 0x0c,
  0x12, 0xd6, 0x11, 0x48, 0x79, 0xd4, 0xf7, 0x24, 0xe5, 0xd7, 0x21, 0x01, 0x4e,
  0x56, 0xf1, 0x8a, 0xfa, 0xe0, 0xc2, 0xfe, 0xd5, 0xd2, 0x6a, 0xd2, 0xb2, 0xdd,
  0xdb, 0xb7, 0x29, 0x0f, 0xbe, 0xf2, 0x16, 0xc9, 0x93, 0x04, 0xc1, 0xd6, 0xc6,
  0x68, 0xc7, 0x24, 0x1f, 0xbb, 0xba, 0xfc, 0x69, 0xbc, 0x66, 0x78, 0xb8, 0xd8,
  0x3f, 0xfc, 0xb2, 0x8f, 0x6a, 0xbb, 0xca, 0x41, 0x9a, 0x3c, 0xe4, 0xbe, 0x48,
  0x38, 0x07, 0xc0, 0x4a, 0x6d, 0xb4, 0x73, 0x3d, 0x66, 0x2c, 0xcc, 0x2a, 0x44,
  0xe2, 0x07, 0xb0, 0x55, 0x2e, 0x83, 0xba, 0xfa, 0xff, 0x68, 0xe8, 0xdd, 0xcd,
  0xb2, 0x41, 0x39, 0x34, 0x2a, 0x93, 0x14, 0x44, 0x13, 0x7e, 0xdf, 0xe4, 0x3d,
  0xbd, 0x28, 0xe1, 0x65, 0xb1, 0xb5, 0xbc, 0x0a, 0xcf, 0x51, 0xf8, 0x6b, 0xfa,
  0xd7, 0x87, 0xba, 0x1b, 0x3f, 0x72, 0x62, 0x4d, 0x2e, 0x02, 0x13, 0xab, 0x0f,
  0x18, 0xab, 0x03, 0x4e, 0x6a, 0xac, 0xe4, 0x36, 0x6b, 0xba, 0x47, 0x74, 0xe8,
  0x64, 0xfc, 0x5b, 0x3c, 0x2e, 0xd8, 0xc2, 0xd0, 0x02, 0x8b, 0xd0, 0x9f, 0xb4,
  0x4e, 0x46, 0xea, 0x65, 0x13, 0x2c, 0x40, 0xe0, 0x53, 0x91, 0xac, 0x54, 0x4b,
  0x97, 0x08, 0x73, 0xde, 0x5b, 0x6d, 0xda, 0xef, 0x77, 0xc9, 0xef, 0x36, 0x7a,
  0x85, 0x09, 0x84, 0x1c, 0xcc, 0x66, 0x32, 0xd9, 0x39, 0xbe, 0x58, 0x00, 0x51,
  0x74, 0xcc, 0x33, 0x72, 0xe5, 0x13, 0xcf, 0xf9, 0x1f, 0x3b, 0x96, 0xb9, 0x6f,
  0x8f, 0xc0, 0xed, 0x1d, 0xac, 0xc4, 0x83, 0x57, 0xf1, 0x4c, 0xe7, 0x26, 0x5b,
  0x4d, 0x0d, 0x88, 0xfd, 0x79, 0x35, 0x7f, 0xd8, 0xfb, 0x4d, 0x9c, 0xad, 0xda,
  0x69, 0x5e, 0xb5, 0x84, 0x5d, 0x3a, 0xa9, 0x66, 0xe2, 0x5e, 0xea, 0x12, 0xac,
  0xf9, 0xa2, 0x2e, 0x0a, 0xa1, 0x76, 0xfd, 0xe2, 0x5e, 0x23, 0x5f, 0x2f, 0xf6,
  0x2b, 0x44, 0x84, 0x19, 0x04, 0x1a, 0xd3, 0x62, 0xa2, 0xe1, 0x1c, 0xc4, 0x19,
  0xe1, 0xae, 0x33, 0x20, 0x8f, 0x2c, 0xc7, 0x2d, 0x7c, 0xcf, 0xfe, 0x3a, 0x01,
  0x32, 0x7c, 0xaf, 0x41, 0xd9, 0x71, 0x9f, 0x0f, 0x1c, 0x48, 0xa5, 0x3a, 0x0f,
  0x3f, 0xcb, 0x73, 0xf9, 0x9b, 0xdc, 0x7b, 0xf0, 0xb0, 0x4b, 0x2d, 0x2b, 0x2a,
  0x2d, 0x56, 0x3e, 0x5d, 0xc7, 0xeb, 0xea, 0x85, 0xe4, 0x53, 0xdf, 0x6a, 0xd8,
  0x2d, 0x53, 0x10, 0xfe, 0x4d, 0xa4, 0x03, 0x4e, 0x55, 0x5f, 0x46, 0x5d, 0x22,
  0x99, 0x7e, 0x03, 0xe2, 0xac, 0x41, 0xbf, 0x49, 0xdf, 0xc5, 0xf7, 0x93, 0x1e,
  0x9b, 0xb1, 0x0f, 0x70, 0x10, 0x8a, 0x56, 0xb9, 0x00, 0xd1, 0x75, 0xeb, 0x75,
  0x54, 0x58, 0xea, 0x80, 0xed, 0x24, 0xf2, 0xa0, 0x78, 0xe8, 0x48, 0x72, 0x4c,
  0x79, 0x2e, 0x45, 0x80, 0x00, 0x00,
]);

const imageBlob = new Blob([imageData], { type: "image/webp" });

const imageURL = URL.createObjectURL(imageBlob);

const image = document.createElement("img");
image.src = imageURL;
document.body.append(image);
```
