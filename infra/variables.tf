variable "alarm_notification_email" {
  type        = string
  description = "Email address to receive CloudWatch alarm notifications"
  sensitive   = true
}


variable "slack_webhook_url" {
  type        = string
  description = "Slack webhook URL for sending notifications"
  sensitive   = true
}