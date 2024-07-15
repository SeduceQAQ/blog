# 通过CloudTrail对DynamoDB项目级api的调用进行监控

## 背景

某天突然发现DynamoDB中的数据被某人给删除了！
通过查看指标发现，在某一段时间内DynamoDB表中出现大量Write操作，这估计就是某人进行了大批量的删除操作。

想要确定到底是谁干的好事，首先就想到了CloudTrail。
果断来到CloudTrail进行排查，但是经过确认，
CloudTrail的Event history默认仅会记录账户的管理事件，不会记录S3和DynamoDB等资源的对象级api操作。
结果导致大家全都不吱声，都说不是自己干的。。。

为了防止之后再出现这种问题，需要对DynamoDB的操作进行详细记录。
这就引出了今天的主角：CloudTrail的Trails组件

## Trails功能

当我们需要对DynamoDB对象级api操作（数据事件）进行监控时，
可以使用Trails组件来创建自定义的Trail对数据事件进行跟踪

