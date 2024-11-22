# Uint8ClampedArray

`Uint8ClampedArray`与`Uint8Array`类似，最大的不同是当元素数值发生上溢，会保持最大值 255；而当数值发生下溢，会保持最小值 0。

```javascript
const u8c = new Uint8ClampedArray([255, 256, 512, 0, -1, -128]);
u8c; // [255, 255, 255, 0, 0, 0]

u8c[0] = 1024;
u8c[0]; // 255

u8c[1] = -1024;
u8c[1]; // 0
```
