# FileReader

`FileReader`用于从 Blob 中读取实际可供 JavaScript 语言处理的数据。FileReader 出现于 ES5 时代，因此它的异步操作是基于事件回调的，而不是更现代化的 Promise。

FileReader 的总体使用方式可以总结如下：

1. 创建 FileReader 对象
2. 订阅 FileReader 对象的事件并作相应处理
   - `load`事件表示已经读取完毕，可以通过`result`属性获取读到的数据，不同的读取方法会得到不同的数据类型
   - `error`事件表示读取过程中发生错误
   - `loadstart`事件表示开始读取
   - `loadend`事件表示读取结束，无论最终是成功还是失败
3. 执行读取操作，等待之前订阅的事件触发
   - `readAsArrayBuffer(blob)`方法将 Blob 内容读取为 ArrayBuffer
   - `readAsText(blob[, encoding])`方法将 Blob 内容读取为 string
   - `readAsDataURL(blob)`方法将 Blob 内容读取为`data:`格式的内容内嵌的 URL

## 示例：读取 Blob 中的文本

我们将构造一个包含文本的 Blob，然后通过`readAsText()`将其读出。

```javascript
const blob = new Blob(["hello world!"], { type: "text/plain" });

const reader = new FileReader();
reader.addEventListener("load", function () {
  console.log("got text:", this.result);
});
reader.readAsText(blob);
```

## `readyState`状态机

FileReader 对象的`readyState`属性指示当前的读取状态在哪一阶段，可能的值有：

| readyState           | 值  | 描述                 |
| -------------------- | --- | -------------------- |
| `FileReader.EMPTY`   | 0   | 尚未读取任何内容     |
| `FileReader.LOADING` | 1   | 正在读取             |
| `FileReader.DONE`    | 2   | 所有内容都已读取完成 |

让我们尝试订阅状态变更事件，并打印出`readyState`的值：

```javascript
const blob = new Blob(["hello world!"], { type: "text/plain" });

function onEventFired(e) {
  console.log(`event: ${e.type}, ready state: ${this.readyState}`);
}

const reader = new FileReader();
console.log(`ready state: ${reader.readyState}`);
reader.addEventListener("loadstart", onEventFired);
reader.addEventListener("loadend", onEventFired);
reader.addEventListener("load", onEventFired);
reader.readAsText(blob);
```

执行后输出：

```
ready state: 0
event: loadstart, ready state: 1
event: load, ready state: 2
event: loadend, ready state: 2
```

## 其它属性和方法

abort

progress
