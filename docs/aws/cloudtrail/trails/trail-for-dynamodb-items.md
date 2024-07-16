# 通过CloudTrail对数据事件的调用进行监控

CloudTrail默认提供的`Event history`仅会记录账户中的管理事件，不会跟踪S3和DynamoDB等资源的数据事件（对象级api操作）。

本文以DynamoDB举例，当我们需要对DynamoDB的数据事件进行跟踪时，
需要使用CloudTrail的`Trails`组件来创建自定义的Trail对数据事件进行跟踪。

## 为DynamoDB创建数据事件的监控

### 测试环境准备：DynamoDB

DynamoDB测试表名为：Transactions。 数据格式如下：

其中`transactionId`作为`Partition Key`，`productId`作为`Sort Key`

```json
{
  "transactionId": "string",
  "productId": "number",
  "amount": "number",
  "price": "number"
}
```

为了方便测试，提供Terraform代码创建测试表，并添加测试数据

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

# 添加测试项目
resource "aws_dynamodb_table_item" "item1" {
  table_name = aws_dynamodb_table.Transactions.name
  hash_key   = aws_dynamodb_table.Transactions.hash_key
  range_key = aws_dynamodb_table.Transactions.range_key
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
  range_key = aws_dynamodb_table.Transactions.range_key
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
  range_key = aws_dynamodb_table.Transactions.range_key
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

### 创建Trail

使用Trail跟踪数据事件时，我们可以指定