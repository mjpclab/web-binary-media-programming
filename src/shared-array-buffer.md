# SharedArrayBuffer

`SharedArrayBuffer`具有和`ArrayBuffer`几乎相同的 API 调用接口，不同之处在于，`SharedArrayBuffer`是不可转移对象。调用`postMessage(message[, transfer])`时不能将该对象放入第二个参数`transfer`的列表中。

然而，当把`SharedArrayBuffer`或在其上建立的视图对象通过结构化克隆进行传递时，只会传递其指向实际数据的引用，所以不会导致数据的复制，而是会共享相同的内存空间。

## 配置启用 SharedArrayBuffer

由于安全上的要求，使用`SharedArrayBuffer`必须启用跨源隔离，配置要求为：

- 页面的响应头需要设置
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`
- 页面的域名为`localhost`或协议为`https:`

通过检查全局对象的`crossOriginIsolated`属性来确定跨源隔离是否生效。

## 验证数据共享特性

我们可以通过将数据传递给 Worker 并修改数据，然后在 Worker 中异步地延迟读取数据，看看能否读到修改后的数据，来验证`SharedArrayBuffer`是否能够共享内存数据。通过`postMessage()`在标签页间传递数据的方法也是可以的。

```javascript
// 主线程
const buffer = new SharedArrayBuffer(8);
const arr = new Uint16Array(buffer);

const worker = new Worker("worker.js");
worker.postMessage(buffer);
worker.postMessage(arr);
arr[0] = 257;
```

```javascript
// Worker线程
addEventListener("message", e => {
  setTimeout(() => {
    if (e.data instanceof SharedArrayBuffer) {
      console.log(new Uint8Array(e.data));
    } else {
      console.log(e.data);
    }
  });
});
/* 输出：
Uint8Array(8) [1, 1, 0, 0, 0, 0, 0, 0]
Uint16Array(4) [ 257, 0, 0, 0 ]
*/
```

在`worker.postMessage(）`后立即修改了数据，如果数据是按复制传递的，那么之后的修改不会影响 Worker 中接受到的数据，反之，则修改对 Worker 可见。在 Worker 中通过`setTimeout`使得读取消息数据的操作会在下一轮消息循环中执行，因而能保证主线程在`postMessage()`之后的代码能先执行完毕。从输出结果来看，Worker 线程看到了主线程的修改，因而证实了`SharedArrayBuffer`的内存数据是共享的。

## 避免数据竞争

数据共享就会带来竟态条件（Race Condition），运行时提供了`Atomics`命名空间，其下包含了许多用于控制原子操作的方法。感兴趣的读者请自行查阅相关资料，本书不作展开。

## 增长长度

对于指定了`maxByteLength`的`ArrayBuffer`，可以动态伸缩长度。而对于`SharedArrayBuffer`来说，只能增长大小，而不能收缩。

实例属性`growable`取代了`resizable`，表示该`SharedArrayBuffer`是否可增长。实例方法`grow(newLength)`取代了`resize(newLength)`用于增长`SharedArrayBuffer`的长度，不超过`maxByteLength`。

```javascript
const growable = new SharedArrayBuffer(4, { maxByteLength: 16 });
growable.byteLength; // 4

growable.grow(8); // 8
growable.byteLength;

growable.grow(4);
// throws Invalid length parameter
```
