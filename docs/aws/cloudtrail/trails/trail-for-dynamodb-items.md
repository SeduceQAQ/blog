# 通过CloudTrail跟踪数据事件

CloudTrail默认提供的`Event history`仅会记录账户中的管理事件，不会跟踪S3和DynamoDB等资源的数据事件（对象级api操作）。

本文以DynamoDB举例，当我们需要对DynamoDB的数据事件进行跟踪时，
需要使用CloudTrail的`Trails`组件来创建自定义的Trail对数据事件进行跟踪。

## 为DynamoDB创建数据事件的监控

### 测试环境准备：DynamoDB

DynamoDB测试表名为：Transactions。 数据格式如下：

```json
{
  "transactionId": "string",
  "productId": "number",
  "amount": "number",
  "price": "number"
}
```

其中`transactionId`作为`Partition Key`，`productId`作为`Sort Key`

为了方便测试，提供Terraform代码创建测试表，并添加测试数据。

::: details Terraform代码

```terraform
provider "aws" {
  region = "ap-northeast-1"
}

# 创建DynamoDB表
resource "aws_dynamodb_table" "Transactions" {
  name         = "Transactions"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "transactionId"
    type = "S"
  }

  attribute {
    name = "productId"
    type = "N"
  }

  hash_key  = "transactionId"
  range_key = "productId"

  tags = {
    Name        = "Transactions"
    Environment = "test"
  }
}

# 添加测试item
resource "aws_dynamodb_table_item" "item1" {
  table_name = aws_dynamodb_table.Transactions.name
  hash_key   = aws_dynamodb_table.Transactions.hash_key
  range_key  = aws_dynamodb_table.Transactions.range_key
  item       = <<ITEM
  {
    "transactionId" : { "S" : "00001" },
    "productId" : { "N" : "1" },
    "amount" : { "N" : "10" },
    "price" : { "N" : "10" }
  }
ITEM
}

resource "aws_dynamodb_table_item" "item2" {
  table_name = aws_dynamodb_table.Transactions.name
  hash_key   = aws_dynamodb_table.Transactions.hash_key
  range_key  = aws_dynamodb_table.Transactions.range_key
  item       = <<ITEM
{
    "transactionId" : { "S" : "00002" },
    "productId" : { "N" : "2" },
    "amount" : { "N" : "20" },
    "price" : { "N" : "20" }
  }
ITEM
}

resource "aws_dynamodb_table_item" "item3" {
  table_name = aws_dynamodb_table.Transactions.name
  hash_key   = aws_dynamodb_table.Transactions.hash_key
  range_key  = aws_dynamodb_table.Transactions.range_key
  item       = <<ITEM
  {
    "transactionId" : { "S" : "00003" },
    "productId" : { "N" : "3" },
    "amount" : { "N" : "30" },
    "price" : { "N" : "30" }
  }
ITEM
}
```

:::

![](https://picture.seduceqaq.com/piclist/2024/07/17/20240717120505.jpg)

### 创建Trail

使用Trail跟踪数据事件时，我们可以通过配置资源的ARN和数据事件的名称对跟踪事件进行筛选过滤，从而仅记录我们想要跟踪的事件。

我们将会跟踪指定DynamoDB中的`DeleteItem`和`UpdateItem`事件作为演示。
其它可跟踪事件名称可以参考官方文档：[DynamoDB data plane events in CloudTrail](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/logging-using-cloudtrail.html#ddb-data-plane-events-in-cloudtrail)

具体配置如下：

![](https://picture.seduceqaq.com/piclist/2024/07/17/20240717142707.jpg)

::: info

为了方便查看日志，在创建Trail时，勾选了`CloudWatch Logs`选项，将跟踪日志副本发送到CloudWatch中。
之后我们会在CloudWatch中查看和验证跟踪日志。

:::

### 测试效果

在DynamoDB中进行更新和删除操作后，在CloudWatch中对查看跟踪日志。

经过一段时间后，在CloudWatch中出现了相关日志：

![](https://picture.seduceqaq.com/piclist/2024/07/17/20240717144755.jpg)

截取`UpdateItem`事件的部分日志，可以看到对哪个`item`进行了更新。
日志中会记录更新`item`的分区键和更新了哪些属性。

![](https://picture.seduceqaq.com/piclist/2024/07/17/20240717150320.jpg)

`DeleteItem`的日志和`UpdateItem`相似，但仅记录了删除`item`的分区键。

![](https://picture.seduceqaq.com/piclist/2024/07/17/20240717150624.jpg)

## 注意

CloudTrail的Trails组件主要用于跟踪“谁”（用户或角色等）在什么时间对什么资源进行了什么操作。
正如日志中所展示的那样，并不会对属性值进行详细的跟踪，仅跟踪了具体的分区键和影响到的属性值。

如果需要跟踪`item`的具体变化情况，比如某个属性具体从什么值更新到了什么值，则需要使用DynamoDB自身的`Streams`组件进行跟踪。
