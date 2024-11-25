# Blob

## 创建 Blob

语法：

```javascript
new Blob(blobParts);
new Blob(blobParts, options);
```

`blobParts`是一个可迭代对象，每个元素都可以是 ArrayBuffer、类型化数组、DataView、Blob、File 或 string 中任意一种，他们被连接起来作为 Blob 的底层数据来源。

`options`对象可指定属性`type`，用于表示 Blob 二进制数据的 MIME 类型。

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
