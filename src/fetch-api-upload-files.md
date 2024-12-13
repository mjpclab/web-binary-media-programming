# 上传文件

为了使用 Fetch API 上传文件，我们需要把构建好的 FormData 数据传递给 fetch API，它将使请求以`multipart/form-data`形式编码，以便将文件上传到服务器。。

我们先启动[GHFS](https://github.com/mjpclab/go-http-file-server)服务器并启用上传功能，也可以使用其它支持`multipart/form-data`文件上传的 Web 服务器。

```shell
ghfs -l 8080 -r /tmp/ --upload / --cors /
```

## 以 URL 的形式使用 Fetch

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

## 以 Request 对象的形式使用 Fetch

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

### 读取 Request 对象数据

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
