# DynamoDB Streams介绍和示例

## 什么是`change data capture(CDC)`

- `CDC`可以将所有项目级别的修改复制到数据流。
  DynamoDB Streams是`CDC`的一种实现。
- `CDC`在DynamoDB中有两种实现
  1. DynamoDB Streams
  2. Kinesis Data Streams for DynamoDB
  > 关于这两种实现的区别可以参考官方文档：[Streaming options for change data capture](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/streamsmain.html#streamsmain.choose)