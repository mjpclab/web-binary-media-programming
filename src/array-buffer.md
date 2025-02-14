# ArrayBuffer

ArrayBuffer 代表底层内存的二进制数据缓冲区，它是固定长度且连续的。ArrayBuffer 不关心数据应该被如何解读，因为这是由上层视图（如类型化数组或 DataView）负责的。

## 创建 ArrayBuffer

ArrayBuffer 实例拥有一个初始长度，一个可选的最大长度。

构造函数的第一个参数指定 ArrayBuffer 的初始长度。可选的第二个参数是一个选项对象，其属性`maxByteLength`用于指定其最大长度，运行时也可以据此优化内存分配策略。

```javascript
const fixed = new ArrayBuffer(4);
const flex = new ArrayBuffer(4, { maxByteLength: 16 });
```

## 获取长度信息

实例属性`byteLength`返回当前长度，`maxByteLength`返回最大长度。

```javascript
const fixed = new ArrayBuffer(4);
fixed.byteLength; // 4
fixed.maxByteLength; // 4

const flex = new ArrayBuffer(4, { maxByteLength: 16 });
flex.byteLength; // 4
flex.maxByteLength; // 16
```

## 更改长度

对于指定了`maxByteLength`的 ArrayBuffer 实例，可以在`maxByteLength`的范围内更改长度，可以扩展也可以收缩，被收缩部分的字节变得不可见，被扩展的字节初始化为`0`。可以通过实例的`resizable`属性检查是否可更改长度，通过`resize(newLength)`更改长度。

```javascript
const fixed = new ArrayBuffer(4);
const flex = new ArrayBuffer(4, { maxByteLength: 16 });

flex.resizable; // true
flex.resize(12);
flex.byteLength; // 12
flex.maxByteLength; // 16

flex.resize(2);
flex.byteLength; // 2
flex.maxByteLength; // 16

flex.resize(20);
// throws RangeError
// ArrayBuffer.prototype.resize: Invalid length parameter

fixed.resizable; // false

fixed.resize(2);
// throws TypeError
// Method ArrayBuffer.prototype.resize
// called on incompatible receiver #<ArrayBuffer>
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

两个位置参数都可以是负数，代表从 ArrayBuffer 末尾开始倒数的位置。
