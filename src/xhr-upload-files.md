# 上传文件

当我们把 FormData 传递给 XMLHttpRequest.send()方法时，FormData 中的数据会被序列化到请求体（Request Body）中，其编码方式为`multipart/form-data`，效果与通过表单上传文件相同。

我们先启动[GHFS](https://github.com/mjpclab/go-http-file-server)服务器并启用上传功能，也可以使用其它支持`multipart/form-data`文件上传的 Web 服务器。

```shell
ghfs -l 8080 -r /tmp/ --upload / --cors /
```

让我们以脚本的方式上传文件，先准备好包含 Blob 字段的 FormData 对象，然后传递给 XHR 对象的`send()`方法。

```javascript
const data = new FormData();
data.append("file", new Blob(["file 1 content"]), "file1.txt");
data.append("file", new Blob(["file 2 content"]), "file2.txt");

const xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:8080/?upload");
xhr.send(data);
xhr.addEventListener("load", () => {
  console.log("upload done");
});
```
