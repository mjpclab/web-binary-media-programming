# 二进制响应

执行`fetch`操作后，可以解决 Promise 得到表示服务器端响应的`Response`对象，其中除了常用的`text()`和`json()`方法，还有一些用于获取二进制响应数据的方法。

- `arrayBuffer()`：以`Promise<ArrayBuffer>`的形式返回响应体数据
- `blob()`：以`Promise<Blob>`的形式返回响应体数据
- `bytes()`：以`Promise<Uint8Array>`的形式返回响应体数据

举例：

```javascript
const response = await fetch("/");
const blob = await response.blob();
// doWith(blob);
```

Response 对象数据仅可读取一次，如要多次读取，应该对尚未执行读取操作的 Response 对象执行`clone()`方法，得到 Response 对象的一个副本，每个副本都可以读取一次：

```javascript
const response = await fetch("/");

const r1 = response.clone();
await r1.text();
await r1.text(); // throws: body stream already read

const r2 = response.clone();
await r2.text();
```
