# XMLHttpRequest 二进制响应

为了能将服务器端响应当作二进制缓冲区，并在之后加以利用，`XMLHttpRequest`对象增加了`responseType`属性，用于指定响应体数据应该以何种形式存在。

与二进制数据有关的`responseType`取值有`arraybuffer`和`blob`两种。

```javascript
const xhr = new XMLHttpRequest();
xhr.responseType = "blob";
xhr.addEventListener("load", function () {
  const blob = this.response;
  // doWith(blob);
});
xhr.open("GET", "/");
xhr.send();
```
