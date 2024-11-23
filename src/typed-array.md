# 类型化数组

JavaScript 中的普通数组是非类型化的，即数组中可以存放任意类型的元素，且一个数组中的多个元素也可以是不同的类型。

相反，类型化数组实例有一个固定的类型，其中只能存储相应类型的元素。目前 JavaScript 中支持的类型化数组如下：

**整型类型化数组**

| 类型              | 符号 | 元素字节长度 |
| ----------------- | ---- | ------------ |
| Int8Array         | 有   | 1            |
| Uint8Array        | 无   | 1            |
| Uint8ClampedArray | 无   | 1            |
| Int16Array        | 有   | 2            |
| Uint16Array       | 无   | 2            |
| Int32Array        | 有   | 4            |
| Uint32Array       | 无   | 4            |
| BigInt64Array     | 有   | 8            |
| BigUint64Array    | 无   | 8            |

**浮点类型化数组**

| 类型         | 元素字节长度 |
| ------------ | ------------ |
| Float16Array | 2            |
| Float32Array | 4            |
| Float64Array | 8            |

## 作为视图的类型化数组

类型化数组是[ArrayBuffer](array-buffer.md)的上层视图，通过类型化数组可以查看和修改其底层 ArrayBuffer 的字节数据。

同一个 ArrayBuffer，使用不同的类型化数组去解读或修改，会得到不同的结果。以下示例展示了`Uint8Array`和`Uint16Array`对同一个 ArrayBuffer 的不同解读，并假设数值为 16 进制：

```
ArrayBuffer(byteLength=8) | 00   01   02   03   04   05   06   07 |
Uint8Array(length=8)      | 00 | 01 | 02 | 03 | 04 | 05 | 06 | 07 |
Uint16Array(length=4)     |  00 01  |  02 03  |  04 05  |  06 07  |
```

上例中`Uint8Array`将底层 ArrayBuffer 的每一个字节解读为一个元素，而`Uint16Array`却将连续的两个字节解读为一个元素。当我们通过下标访问`Uint8Array`中的元素时，其返回 ArrayBuffer 中具体字节的值；而通过`Uint16Array`访问某个下标时，会取出对应位置连续的两个字节，把它当作一个无符号 16 位整型值返回。例如以`array[1]`的形式访问`Uint16Array`，在小端序的架构上返回的值代表`0x0302`。

## 创建类型化数组

### 通过普通数组初始化

可通过非类型化数组的值来初始化类型化数组，超出元素长度的值会被截断，构造函数会自动创建对应的底层 ArrayBuffer：

```javascript
const arrI8 = new Int8Array([0, 1, 2, 3, 32767, 32768]);
arrI8; // [0, 1, 2, 3, -1, 0]
```

### 通过已有的类型化数组创建新的类型化数组

通过已有的类型化数组创建新的类型化数组，效果与通过普通数组初始化相同。

```javascript
const arrU16 = new Uint16Array([65535, 65536]);
const arrI8 = new Int8Array(arrU16);
arrI8; // [-1, 0 ]
```

### 通过指定数组长度创建

可以指定数组的元素个数，他们将被初始化为`0`：

```javascript
const arr16 = new Int16Array(3);
arr16; // [0, 0, 0]
```

### 通过已有的 ArrayBuffer 创建

语法：

```javascript
new TypedArray(buffer);
new TypedArray(buffer, byteOffset);
new TypedArray(buffer, byteOffset, length);
```

当通过已有的 ArrayBuffer 创建类型化数组时，构造函数不再单独创建新的 ArrayBuffer,而是将传入的 ArrayBuffer 作为底层缓冲区使用。可以通过一个 ArrayBuffer 构造多个不同的类型化数组，他们将共享相同的底层数组。

还可以额外指定要创建的数组所使用的 ArrayBuffer 的起始位置（偏移量）和长度（元素个数），这两个参数都是可选的。

```javascript
const buffer = new ArrayBuffer(16);

const u8 = new Uint8Array(buffer);
u8.forEach((v, i) => {
  u8[i] = i;
});
[...u8].map((v) => v.toString(16));
// ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

const u16 = new Uint16Array(buffer);
u16[1].toString(16); // 302，buffer字节位置2、3值的小端序表示：0x0302

const i16 = new Int16Array(buffer, 2, 4);
[...i16].map((n) => n.toString(16)); //  ['302', '504', '706', '908']
```

### 通过迭代器创建

将迭代器传入构造函数，可以创建包含迭代器返回值的类型化数组。

```javascript
function* threeNumbers() {
  yield 10;
  yield 20;
  yield 30;
}
const u8 = new Uint8Array(threeNumbers());

u8; // [10, 20, 30]
```

### 使用`TypedArray.from()`通过可迭代对象或类数组创建

语法：

```javascript
TypedArray.from(list);
TypedArray.from(list, mapFn);
TypedArray.from(list, mapFn, thisArg);
```

如果只传入第一个参数，大部分情况下，该方法与将普通数组或类型化数组传入构造函数效果相同，但该方法有一个特别的用法是可以分解字符串值，因为字符串也是可迭代对象。

```javascript
Uint8Array.from([1, 2, 3]); // [1, 2, 3]
Uint16Array.from("123456"); // [1, 2, 3, 4, 5, 6]
```

可以在创建时同时指定第二个参数（map 函数）对输入数据做变换：

```javascript
const source = [1, 2, 3];
const dest = Int16Array.from(source, (n) => n * n);
dest; // [1, 4, 9]
```

### 使用`TypedArray.of()`通过枚举列表创建

```javascript
Uint8Array.of(10, 20, 30); // [10, 20, 30]

const primes = [2n, 3n, 5n, 7n, 11n];
BigUint64Array.of(...primes); // [2n, 3n, 5n, 7n, 11n]
```

## 代表 ArrayBuffer 视图

静态方法`ArrayBuffer.isView()`可以验证某个对象是不是 ArrayBuffer 的视图。由于类型化数组是ArrayBuffer的视图，所以会返回`true`。

```javascript
ArrayBuffer.isView(new Int8Array(1)); // true
ArrayBuffer.isView(new Float32Array(5)); // true
ArrayBuffer.isView([]); //false
```

## 通用属性

### 静态属性

静态属性`BYTES_PER_ELEMENT`指示该种类型化数组每个元素占用的字节长度。

```javascript
Int8Array.BYTES_PER_ELEMENT; // 1
Int16Array.BYTES_PER_ELEMENT; // 2
Float32Array.BYTES_PER_ELEMENT; // 4
BigUint64Array.BYTES_PER_ELEMENT; // 8
```

### 实例属性

`length`指示数组长度（元素个数），而`byteLength`指示数组的字节长度：

```javascript
const u32 = new Uint32Array(10);
u32.length; // 10
u32.byteLength; // 40
```

`byteOffset`指示数组的开头在底层 ArrayBuffer 中的偏移量：

```javascript
const buffer = new ArrayBuffer(16);

const u8 = new Uint8Array(buffer);
u8.forEach((v, i) => {
  u8[i] = i;
});

const bytes = new Uint8Array(buffer, 2, 5);
bytes; // [2, 3, 4, 5, 6]
bytes.byteOffset; // 2
```

通过`buffer`属性可以访问底层 ArrayBuffer：

```javascript
const u8 = new Uint8Array(2);
u8[1] = 255;
const u16 = new Uint16Array(u8.buffer);
u16[0].toString(16); // ff00（小端序）
```

## 通用方法

类型化数组有一些普通数组也有的通用方法，例如`forEach`、`find`、`indexOf`等，此处不再赘述。

### `map()`返回同类型数组

类型化数组的`map`方法在对现有数组元素执行映射逻辑后，返回新的相同类型的类型化数组：

```javascript
const u8 = new Uint8Array([1, 2, 3, 4, 5]);
const mapped = u8.map((n) => n * 10);
mapped; // [10, 20, 30, 40, 50]
mapped instanceof Uint8Array; // true
```

### `set()`：从其它数组写入连续元素

语法：

```javascript
typedArray.set(sourceArray);
typedArray.set(sourceArray, targetOffset);
```

其中`sourceArray`既可以是普通数组，也可以是类型化数组，可选的`targetOffset`指定写入目标数组`typedArray`的起始位置：

```javascript
const bytes = new Uint8Array(8);

bytes.set([1, 2]);
bytes; //  [1, 2, 0, 0, 0, 0, 0, 0]

bytes.set([3, 4], 3);
bytes; // [1, 2, 0, 3, 4, 0, 0, 0];

const list = new Int16Array([7, 8]);
bytes.set(list, 6);
bytes; // [1, 2, 0, 3, 4, 0, 7, 8]
```

### `subarray()`：取子数组

语法：

```javascript
typedArray.subarray();
typedArray.subarray(begin);
typedArray.subarray(begin, end);
```

从`typedArray`取子数组，两个参数分别是开始位置和结束位置。新数组和原数组共享相同的 ArrayBuffer，但各自可以有不同的`byteOffset`。

```javascript
const list = new Int32Array([1, 2, 3, 4, 5, 6]);
let subList;

subList = list.subarray();
subList; // [1, 2, 3, 4, 5, 6]
subList.buffer === list.buffer; // true
subList.byteOffset; // 0

subList = list.subarray(2);
subList; // [3, 4, 5, 6]
subList.buffer === list.buffer; // true
subList.byteOffset; // 8

subList = list.subarray(2, 5);
subList; // [3, 4, 5]
subList.buffer === list.buffer; // true
subList.byteOffset; // 8
```

如需要产生子数组的副本，即元素组和子数组不共享同一个 ArrayBuffer，可以换用`slice`方法：

```javascript
const list = new Int32Array([1, 2, 3, 4, 5, 6]);
const copied = list.slice(2);
copied; // [3, 4, 5, 6]
copied.buffer === list.buffer; // false
```
