# ArrayBuffer 和它的朋友们

ArrayBuffer 是 Web 开发中最底层的二进制表示，其它对象要么是 ArrayBuffer 的包装，要么可以非常方便地转换成 ArrayBuffer，继而通过它再转换成其它各类对象。

ArrayBuffer 中的数据无法被直接访存，而是要通过**视图**来间接地访问。视图有[类型化数组](typed-array.md)和[DataView](data-view.md)两类。
