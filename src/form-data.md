# FormData

`FormData`代表 HTML 表单（Form）以`multipart/formdata`编码提交时，请求体（Request Body）中的数据。`FormData`数据由多个字段组成，每个字段包含键（key，可重复出现）和值（value）。

要上传文件，只需在 FormData 中会包含 Blob 类型的数据，然后通过**XML HTTP Request** API 或 **Fetch** API 将 FormData 实例发送到服务器端。

## 创建 FormData 并添加数据

### 通过脚本创建

```javascript
const data = new FormData();
data.append("user", "unknown");
data.append("file", new Blob(["content of file 1"]));
data.append("file", new Blob(["content of file 2"]), "another.txt");
```

首先通过无参的`FormData()`构造函数创建 FormData 实例。

然后通过`append()`方法添加值，类型为字符串或 Blob。通过上例可知，同一个字段名可以出现多次，如服务器端逻辑实现正确，应当可以处理这种情况。如要避免一个字段名有多个值的情况，希望下次赋值能够覆盖该字段名对应的已存在的值，可以改用`set()`方法。

`append()`和`set()`都可以接受第 3 个可选的文件名参数。如未指定，值为 Blob 类型时默认文件名为"blob"，而值为 File 类型时默认文件名为其`name`属性值。语法如下：

```javascript
formData.append(name, value, [filename]);
formData.set(name, value, [filename]);
```

### 通过已有的 HTML 表单创建

语法：

```javascript
new FormData(form, [submitter]);
```

将 HTML 表单实例传入`FormData()`构造函数，表单域中已有的字段及其值都会被添加到 FormData 实例中。

具有相同`name`的多个字段域都会被添加到 FormData 中，它们有相同的键名称。

对于文件输入框`<input type="file">`中已选择的文件，对应的 File 对象会被加入到 FormData 中。可多选文件的输入框中的多个文件会被拆分成多个键值对，它们有相同的键名称。

可选的`submitter`用于模拟表单提交时点击提交按钮后，如果提交按钮本身带有`name`，会将其`value`一并提交。

举例：

```html
<form>
  <input type="file" name="attachment" />
  <input type="file" name="attachment" />
  <input type="submit" name="submit" value="1" />
</form>
```

```javascript
const form = document.querySelector("form");

const data1 = new FormData(form);
[...data1.entries()]; // [['attachment', File],['attachment', File]]

const data2 = new FormData(form, form["submit"]);
[...data2.entries()]; // [['attachment', File],['attachment', File], ['submit', 1]]
```

通过已有的 HTML 表单创建 FormData 后，依旧可以调用`append()`或`set()`方法追加或设置新的键值对。

## FormData 实例的其它方法

除了上文提到的`append()`和`set()`方法，FormData 还有一些其它方法。由于 FormData 代表表单提交时的键值对数据，因而它有着和`Map`对象类似的方法。

### 删除字段

删除指定名称的字段，多个同名的字段都会被删除：

```javascript
formData.delete(name);
```

### 获取字段中的值

`get()`方法获取首个匹配名称的字段值，如不存在匹配则返回`null`。

`getAll()`方法以数组形式返回所有匹配名称的字段值，如不存在匹配则返回空数组。

```javascript
formData.get(name);
formData.getAll(name);
```

### 检查字段名存在性

`has()`方法用于检查指定字段名是否存在于 FormData 中：

```javascript
formData.has(name);
```

### 以迭代方式访问 FormData 数据

可以迭代 FormData 中的键、值或键值对：

```javascript
formData.keys();
formData.values();
formData.entries();
```

举例：

```javascript
const data = new FormData();
data.append("x", 1);
data.append("x", 2);
data.append("y", 100);

for (const [k, v] of data.entries()) {
  console.log(`${k} = ${v}`);
}
```
