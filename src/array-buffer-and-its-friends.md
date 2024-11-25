# ArrayBuffer和它的朋友们

ArrayBuffer是Web开发中最底层的二进制表示，其他对象要么是ArrayBuffer的包装，要么可以非常方便地转换成ArrayBuffer,继而通过它再转换成其它各类对象。

ArrayBuffer中的数据无法被直接访存，而是要通过**视图**来间接地访问。视图有类型化数组和DataView两类。
