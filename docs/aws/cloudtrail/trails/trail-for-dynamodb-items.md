# 通过CloudTrail对DynamoDB项目级api的调用进行监控

CloudTrail默认提供的`Event history`仅会记录账户中的管理事件，不会跟踪S3和DynamoDB等资源的对象级api操作（数据事件）。

当我们需要对DynamoDB的数据事件进行跟踪时，
需要使用CloudTrail的`Trails`组件来创建自定义的Trail对数据事件进行跟踪。

## 为DynamoDB创建数据事件的监控

### DynamoDB

DynamoDB测试表名为：Transactions。 数据格式如下：

其中`transactionId`作为`Partition Key`，`productId`作为`Sort Key`

```json
{
  "transactionId": "string",
  "productId": "number",
  "amount": "number",
  "price": "number",
  "date": "date"
}
```

为了方便测试，提供Terraform代码创建测试表，并添加测试数据

::: details Terraform代码

```terraform

```

:::

### 