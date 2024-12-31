# FileList

`FileList`接口表现为类数组，其中每个元素是一个`File`对象。

`length`属性表示 FileList 中 File 对象的数量。

`item(index)`方法返回 FileList 中指定位置的 File 对象。访问`files.item(index)`效果与`files[index]`相同。

`FileList`对象出现在文件表单域和拖放 API 的 DataTransfer 对象中。

## 示例：显示 FileList 文件名列表

本例将接收到的 FileList 对象中的文件名显示在屏幕上。可以通过文件表单域或拖放文件到页面来获取到 FileList 对象。

HTML 页面：

```html
<h1>Select files or drop files</h1>
<input id="fileinput" type="file" multiple />
<pre id="names"></pre>
```

然后写一个通用的打印函数来显示 FileList 中的文件名：

```javascript
const showFileNames = files => {
  names.textContent = "";
  for (let i = 0; i < files.length; i++) {
    names.textContent += files[i].name + "\n";
  }
};
```

通过表单域的`files`属性可以访问到其`FileList`对象，我们通过订阅`change`事件来更新文件名：

```javascript
fileinput.addEventListener("change", e => {
  showFileNames(e.target.files);
});
```

对于拖放操作，我们通过事件对象的`dataTransfer`属性得到`DataTransfer`对象，然后访问其中的`files`：

```javascript
document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => {
  e.preventDefault();
  showFileNames(e.dataTransfer.files);
});
```
