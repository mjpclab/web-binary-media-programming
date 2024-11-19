# ArrayBuffer

ArrayBuffer 代表内存底层二进制数据缓冲区，它不关心数据应该被如何解读，因为这是由上层视图（如类型化数组或数据视图）负责的。

## 创建

ArrayBuffer 实例拥有一个初始长度，一个可选的最大长度。

构造函数的第一个参数指定 ArrayBuffer 的初始长度。可选的第二个参数是一个选项对象，其属性`maxByteLength`用于指定其最大长度，运行时也可以据此优化内存分配策略。

```javascript
const fixed = new ArrayBuffer(4);
const grownable = new ArrayBuffer(4, { maxByteLength: 16 });
```

## 获取长度信息

实例属性`byteLength`返回当前长度，`maxByteLength`返回最大长度。

```javascript
fixed.byteLength; // 4
fixed.maxByteLength; // 4

grownable.byteLength; // 4
grownable.maxByteLength; // 16
```

## 更改长度

对于指定了`maxByteLength`的 ArrayBuffer 实例，可以在`maxByteLength`的范围内更改长度，可以扩展也可以收缩，被收缩部分的字节变得不可见，被扩展的字节初始化为`0`。可以通过实例的`resizable`属性检查是否可更改长度。

```javascript
grownable.resizable; // true
grownable.resize(2);
grownable.byteLength; // 2
grownable.maxByteLength; // 16

grownable.resize(12);
grownable.byteLength; // 12
grownable.maxByteLength; // 16

// throws RangeError
// ArrayBuffer.prototype.resize: Invalid length parameter
grownable.resize(20);

fixed.resizable; // false

// throws TypeError
// Method ArrayBuffer.prototype.resize
// called on incompatible receiver #<ArrayBuffer>
fixed.resize(2);
```

## 创建子切片

使用`slice()`方法，可以取已有 ArrayBuffer 的一个子片段，来产生一个新的 ArrayBuffer 拷贝。第一个参数指定子切片在原 ArrayBuffer 中的起始索引，可选的第二个参数指定终止索引（但不包括该索引，而是该索引的前一个位置）。

```javascript
const buffer = new ArrayBuffer(8);

const slice1 = buffer.slice(2);
slice1.byteLength; // 6

const slice2 = buffer.slice(2, 6);
slice2.byteLength; // 4
```
