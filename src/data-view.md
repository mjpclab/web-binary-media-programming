# DataView

DataView 提供了以指定的字节序在 ArrayBuffer 中读写不同类型数值的能力。

## 创建 DataView

除了指定必须的底层 ArrayBuffer，还可以通过偏移量和长度限制可操作 ArrayBuffer 的范围。语法：

```javascript
new DataView(buffer);
new DataView(buffer, byteOffset);
new DataView(buffer, byteOffset, byteLength);
```

DataView 创建后，可分别通过实例属性`buffer`、`byteOffset`和`byteLength`获取初始化信息。

## 读取和设置值

DataView 通过`getXXX()`方法来获取底层 ArrayBuffer 的值，XXX 为具体的数据类型。语法：

```javascript
dataView.getXXX(byteOffset);
dataView.getXXX(byteOffset, littleEndian);
```

DataView 通过`setXXX()`方法来设置底层 ArrayBuffer 的值。语法：

```javascript
dataView.setXXX(byteOffset, value);
dataView.setXXX(byteOffset, value, littleEndian);
```

当`littleEndian`为 true 时表示使用小端序，不指定时默认为大端序。

`XXX`表示的类型与类型化数组相似，分别为：

- Int8
- Uint8
- Int16
- Uint16
- Int32
- Uint32
- BigInt64
- BigUint64
- Float16
- Float32
- Float64

```javascript
const bytes = new Uint8Array(8);
const view = new DataView(bytes.buffer);

view.setInt8(0, 3);
bytes; // [3, 0, 0, 0, 0, 0, 0, 0]

view.setInt16(3, 512, true);
bytes; // [3, 0, 0, 0, 2, 0, 0, 0]

view.getInt32(4).toString(16); // '2000000'
```

## 代表 ArrayBuffer 视图

静态方法`ArrayBuffer.isView()`可以验证某个对象是不是 ArrayBuffer 的视图。由于 DataView 是 ArrayBuffer 的视图，所以会返回`true`。

```javascript
ArrayBuffer.isView(new DataView(new ArrayBuffer(8))); // true
ArrayBuffer.isView([]); // false
```
