# File

File 接口继承自 Blob，并扩展了一些属性，使其表现得更像文件。

## 扩展属性

`name`表示文件的名称，主要用于向用户展示。

`lastModified`指示文件最后修改时间，以 UNIX 纪元（1970 年 1 月 1 日午夜）以来经过的毫秒数表示。

## 示例：显示本地图片信息

我们将构建一个 HTML 页面，其中有一个文件表单域，当用户选择一张图片文件后，在页面上显示出其文件名、修改日期和图片预览。

先创建一个 HTML 页面，填入必要的元素，特别是文件表单域。还有用于显示文件信息的占位元素：

```html
<input type="file" accept="image/*" id="imagefile" />
<dl>
  <dt>Filename</dt>
  <dd id="filename"></dd>

  <dt>Last modified</dt>
  <dd id="lastmodified"></dd>

  <dt>preview</dt>
  <dd><img id="preview" /></dd>
</dl>
```

然后订阅文件表单域的`change`事件，当用户选择文件后，获取其中的 File 对象实例，并读取其上的信息：

```javascript
imagefile.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  filename.textContent = file.name;
  lastmodified.textContent = new Date(file.lastModified);
  preview.src = URL.createObjectURL(file);
});
```

文件表单域的`files`属性是`FileList`接口实例，它是一个类数组。
