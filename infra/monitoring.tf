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

resource "aws_ssm_parameter" "slack_webhook_url" {
  name  = "/visitor_count/slack_webhook_url"
  type  = "SecureString"
  value = var.slack_webhook_url
}

resource "aws_iam_role" "lambda_notifier_role" {
  name               = "lambda_notifier_role"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust.json

}

data "aws_iam_policy_document" "lambda_notifier" {
  statement {
    actions   = ["ssm:GetParameter", "ssm:GetParameters"]
    resources = [aws_ssm_parameter.slack_webhook_url.arn]
  }
}

resource "aws_iam_policy" "lambda_notifier_policy" {
  name   = "lambda_notifier_policy"
  policy = data.aws_iam_policy_document.lambda_notifier.json
}

resource "aws_iam_role_policy_attachment" "lambda_notifier_attachment" {
  role       = aws_iam_role.lambda_notifier_role.name
  policy_arn = aws_iam_policy.lambda_notifier_policy.arn
}

data "archive_file" "lambda_notifier_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/notifier"
  output_path = "${path.module}/notifier_lambda.zip"
}

resource "aws_lambda_function" "notifier" {
  function_name    = "visitor_count_notifier"
  role             = aws_iam_role.lambda_notifier_role.arn
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.12"
  filename         = data.archive_file.lambda_notifier_zip.output_path
  source_code_hash = data.archive_file.lambda_notifier_zip.output_base64sha256
}

resource "aws_sns_topic_subscription" "lambda_notifier_subscription" {
  topic_arn = aws_sns_topic.visitor_count_alarms.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.notifier.arn
}

resource "aws_lambda_permission" "allow_sns_to_invoke_notifier" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notifier.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.visitor_count_alarms.arn
}