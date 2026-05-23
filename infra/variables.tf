variable "alarm_notification_email" {
  type        = string
  description = "Email address to receive CloudWatch alarm notifications"
  sensitive   = true
}