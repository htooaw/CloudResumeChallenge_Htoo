resource "aws_sns_topic" "visitor_count_alarms" {
  name = "visitor_count_alarms"
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.visitor_count_alarms.arn
  protocol  = "email"
  endpoint  = var.alarm_notification_email
}

resource "aws_cloudwatch_metric_alarm" "lambda_error" {
  alarm_name  = "lambda_error_alarm"
  metric_name = "Errors"
  namespace   = "AWS/Lambda"
  dimensions = {
    FunctionName = aws_lambda_function.visitor_count.function_name
  }
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  alarm_actions       = [aws_sns_topic.visitor_count_alarms.arn]
  alarm_description   = "Alarm when the visitor_count Lambda function encounters an error"
}

resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name  = "lambda_duration_alarm"
  metric_name = "Duration"
  namespace   = "AWS/Lambda"
  dimensions = {
    FunctionName = aws_lambda_function.visitor_count.function_name
  }
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 1
  threshold           = 1000
  comparison_operator = "GreaterThanOrEqualToThreshold"
  alarm_actions       = [aws_sns_topic.visitor_count_alarms.arn]
  alarm_description   = "Alarm when the visitor_count Lambda function duration exceeds the threshold"
}

resource "aws_cloudwatch_metric_alarm" "lambda_high_invocations" {
  alarm_name  = "lambda_high_invocations_alarm"
  metric_name = "Invocations"
  namespace   = "AWS/Lambda"
  dimensions = {
    FunctionName = aws_lambda_function.visitor_count.function_name
  }
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 100
  comparison_operator = "GreaterThanOrEqualToThreshold"
  alarm_actions       = [aws_sns_topic.visitor_count_alarms.arn]
  alarm_description   = "Alarm when the visitor_count Lambda function has a high number of invocations"
}

resource "aws_cloudwatch_metric_alarm" "lambda_api_5xx_error" {
  alarm_name  = "lambda_api_5xx_error_alarm"
  metric_name = "5xx"
  namespace   = "AWS/ApiGateway"
  dimensions = {
    ApiId = aws_apigatewayv2_api.visitor_count_api.id
  }
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  alarm_actions       = [aws_sns_topic.visitor_count_alarms.arn]
  alarm_description   = "Alarm when the visitor_count API Gateway returns a high number of 5XX errors"
}

resource "aws_cloudwatch_metric_alarm" "lambda_api_4xx_error" {
  alarm_name  = "lambda_api_4xx_error_alarm"
  metric_name = "4xx"
  namespace   = "AWS/ApiGateway"
  dimensions = {
    ApiId = aws_apigatewayv2_api.visitor_count_api.id
  }
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 10
  comparison_operator = "GreaterThanOrEqualToThreshold"
  alarm_actions       = [aws_sns_topic.visitor_count_alarms.arn]
  alarm_description   = "Alarm when the visitor_count API Gateway returns a high number of 4XX errors"
}