# DynamoDB Streams介绍和示例

## 什么是`change data capture(CDC)`

- `CDC`可以将所有项目级别的修改复制到数据流。
  DynamoDB Streams是`CDC`的一种实现。
- `CDC`在DynamoDB中有两种实现
  1. DynamoDB Streams
  2. Kinesis Data Streams for DynamoDB
  >
  关于这两种实现的区别可以参考官方文档：[Streaming options for change data capture](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/streamsmain.html#streamsmain.choose)

## DynamoDB Streams

在创建表后，可以在`Exports and streams`标签页中启用`DynamoDB Streams`

![](https://picture.seduceqaq.com/piclist/2024/07/23/20240723193012.webp)

启用`stream`时有四个可选项：

- Keys attributes only：仅记录分区键
- New image：仅记录修改后项目
- Old image：仅记录修改前项目
- New and old images：同时记录修改前和修改后数据

![](https://picture.seduceqaq.com/piclist/2024/07/23/20240723193247.webp)

我们以`New and old images`模式进行演示。

启用`stream`后，绑定一个`Lambda`触发器，对数据流进行处理。

![](https://picture.seduceqaq.com/piclist/2024/07/23/20240723194440.webp)

我们在`Lambda`中直接将数据流中的记录进行输出，在日志中确认记录的格式。

::: details Lambda参考代码

```python
import json

def lambda_handler(event, context):
    print(json.dumps(str))
```

:::

在更新操作的日志中我们可以看到更新前和跟新后的数据记录：

![](https://picture.seduceqaq.com/piclist/2024/07/23/20240723195607.webp)

在删除操作的日志中我们可以看到删除的数据记录：

![](https://picture.seduceqaq.com/piclist/2024/07/23/20240723195941.webp)

## Kinesis Data Streams for DynamoDB