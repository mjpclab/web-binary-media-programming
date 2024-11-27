# Blob 和 File

Blob 和 File 都是接口（Interface），他们代表要操作的对象是不可变的类文件二进制数据。

Blob 包装了底层的数据信息，而 File 继承自 Blob，针对文件的特性扩展了额外的接口。在很多场合，两者可以混用。
