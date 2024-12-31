# 上传文件

## 表单模式上传

当我们把 FormData 传递给`xmlHttpRequest.send()`方法时，FormData 中的数据会被序列化到请求体（Request Body）中，其编码方式为`multipart/form-data`，效果与通过表单上传文件相同。

我们先启动[GHFS](https://github.com/mjpclab/go-http-file-server)服务器并启用上传功能，也可以使用其它支持`multipart/form-data`文件上传的 Web 服务器。

```shell
ghfs -l 8081 -r /tmp/ --upload / --cors /
```

让我们以脚本的方式上传文件，先准备好包含 Blob 字段的 FormData 对象，然后传递给 XHR 对象的`send()`方法。

```javascript
const data = new FormData();
data.append("file", new Blob(["file 1 content"]), "file1.txt");
data.append("file", new Blob(["file 2 content"]), "file2.txt");

const xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:8081/?upload");
xhr.send(data);
xhr.addEventListener("load", () => {
  console.log("upload done");
});
```

## PUT 方法上传

一些服务器还实现了通过`PUT`方法上传单个文件的方法，只需将代表原始文件内容的 Blob 对象作为请求体发送给服务器即可，而提交 URL 通常也是之后获取已上传内容的 URL：

```javascript
const xhr = new XMLHttpRequest();
xhr.open("PUT", "http://localhost/upload/filename");
xhr.send(new Blob(["text content"], { type: "text/plain" }));
```

以上示例仅用于展示可用 Blob 作为上传时的请求体，实际上传文本内容时，也可以直接将 string 传给`send()`方法。
