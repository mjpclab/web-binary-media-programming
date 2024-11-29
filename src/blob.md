# Blob

## 创建 Blob

语法：

```javascript
new Blob(blobParts);
new Blob(blobParts, options);
```

`blobParts`是一个可迭代对象，每个元素都可以是 ArrayBuffer、类型化数组、DataView、Blob、File 或 string 中任意一种，他们被连接起来作为 Blob 的底层数据来源。

`options`对象用于指定可选属性：`type`用于表示 Blob 二进制数据的 MIME 类型；如果数据来源是文本，`endings`决定如何解读换行字符，设置为`transparent`保持原样，设置为`native`自动转化为系统原生换行符。

## 示例：构建一个动态 HTML 页面

我们将在内存中创建一个以 Blob 表示的 HTML 资源，然后创建指向 Blob 的 URL，并将它附到超链接上。

先创建一个引导 HTML 页面，通过其中的超链接，可以打开一个基于 Blob 动态创建的的页面，保持在内存中：

```html
<a target="_blank" id="link">open dynamic page</a>
```

在页面脚本中，动态创建一个 Blob 表示的新 HTML 页面：

```javascript
const blob = new Blob(
  [
    `
<html>
  <head><title>Dynamic page</title></head>
  <body><p>This is a dynamically generated page</p></body>
</html>
`,
  ],
  { type: "text/html" }
);
```

然后创建 URL 对象，并将其附到超链接上：

```javascript
const url = URL.createObjectURL(blob);
document.getElementById("link").href = url;
```

此时，单击超链接将打开一个新的页面，这个新页面的内容是由我们通过 JavaScript 动态产生的！

## Blob 属性

可通过`size`属性获取 Blob 字节长度，通过`type`获取 Blob 在创建时指定的 MIME 类型。观察上例中创建的 Blob：

```javascript
blob.size; // 118
blob.type; // text/html'
```

## Blob 方法

### `arrayBuffer()`：转化为 ArrayBuffer

实例方法`arrayBuffer()`返回`Promise<ArrayBuffer>`，通过此方法可将 Blob 转化为 ArrayBuffer。

### `text()`：转化为 string

实例方法`text()`返回`Promise<string>`，通过此方法可将 Blob 转化为 string，Blob 中的二进制数据按 UTF-8 编码格式解析。

我们顺便来测试下构造函数第二个参数的`endings`属性，在Linux下，原生换行符为`\n`。

```javascript
const sources = ["foo\r\nbar"];
new Blob(sources, { endings: "transparent" }).text().then(txt => {
  console.log("transparent mdoe:", JSON.stringify(txt));
  // transparent mdoe: "foo\r\nbar"
});
new Blob(sources, { endings: "native" }).text().then(txt => {
  console.log("native mode:", JSON.stringify(txt));
  // native mode: "foo\nbar"
});
```

### `slice()`：取 Blob 片段

`slice()`方法提取现有 Blob 中的片段，并创建一个新的 Blob 对象。

语法：

```javascript
blob.slice();
blob.slice(start);
blob.slice(start, end);
blob.slice(start, end, contentType);
```

如果指定了`contentType`参数，可以创建一个和原 Blob `type`类型不同的 Blob。

```javascript
const chars = new Uint8Array([0x41, 0x42, 0x43, 0x44, 0x45, 0x46]);
const b1 = new Blob([chars], { type: "text/plain" });
b1.size; // 6

const b2 = b1.slice(2, 6);
b2.size; // 4
b2.text().then(text => {
  console.log(text); // CDEF
});
```
