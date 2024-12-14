# 上传文件

## 表单模式上传

当我们把构建好的 FormData 数据传递给 fetch API，它将使请求以`multipart/form-data`形式编码，以便将文件上传到服务器，效果与通过表单上传文件相同。

我们先启动[GHFS](https://github.com/mjpclab/go-http-file-server)服务器并启用上传功能，也可以使用其它支持`multipart/form-data`文件上传的 Web 服务器。

```shell
ghfs -l 8080 -r /tmp/ --upload / --cors /
```

### 以 URL 的形式使用 Fetch

如以`fetch(url, options)`的形式使用 fetch，需要将 FormData 对象赋值到`options`选项对象的`body`属性上。

```javascript
const data = new FormData();
data.append("file", new Blob(["file 1 content"]), "file1.txt");
data.append("file", new Blob(["file 2 content"]), "file2.txt");

const response = await fetch("http://localhost:8080/?upload", {
  method: "POST",
  body: data,
});
if (response.ok) {
  console.log("upload done");
}
```

### 以 Request 对象的形式使用 Fetch

也可以先构造 Request 对象，然后传递给`fetch()`函数。构造 Request 对象时，传递 FormData 对象到选项对象的`body`属性上。

```javascript
const data = new FormData();
data.append("file", new Blob(["file 1 content"]), "file1.txt");
data.append("file", new Blob(["file 2 content"]), "file2.txt");

const request = new Request("http://localhost:8080/?upload", {
  method: "POST",
  body: data,
});

const response = await fetch(request);
if (response.ok) {
  console.log("upload done");
}
```

#### 读取 Request 对象数据

构造了 Request 对象后，可以读取其中的数据，内容为 HTTP 请求体（Request Body）。读取 Request 对象的操作一般较为少见。

- `arrayBuffer()`：返回`Promise<ArrayBuffer>`
- `blob()`：返回`Promise<Blob>`
- `bytes()`：返回`Promise<Uint8Array>`
- `formData()`：返回`Promise<FormData>`

```javascript
const data = new FormData();
data.append("file", new Blob(["file 1 content"]), "file1.txt");
data.append("file", new Blob(["file 2 content"]), "file2.txt");

const request = new Request("http://localhost:8080/?upload", {
  method: "POST",
  body: data,
});

const blob = await request.blob();
const text = await blob.text();
// 以上2行可简化为 const text = await request.text()
console.log(text);
```

Request 对象数据仅可读取一次，如要多次读取，应该对尚未执行读取操作的 Request 对象执行`clone()`方法，得到 Request 对象的一个副本，每个副本都可以读取一次：

```javascript
// const request = new Request(...);

const r1 = request.clone();
await r1.text();
await r1.text(); // throws: body stream already read

const r2 = request.clone();
await r2.text();
```

## PUT 方法上传

一些服务器还实现了通过`PUT`方法上传单个文件的方法，只需将代表原始文件内容的 Blob 对象作为请求体发送给服务器即可，而提交 URL 通常也是之后获取已上传内容的 URL：

```javascript
const response = await fetch("http://localhost/upload/filename", {
  method: "PUT",
  body: new Blob(["text content"], { type: "text/plain" }),
});
```

以上示例仅用于展示可用 Blob 作为上传时的请求体，实际上传文本内容时，也可以直接将 string 作为`body`发送。
