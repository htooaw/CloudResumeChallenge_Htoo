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

variable "site_domain" {
  type        = string
  description = "custom domain for the site, Empty string in environments without a custom domain"
  default     = ""
}

variable "use_custom_domain" {
  type        = bool
  description = "Whether to provision Route53+ACM resources"
  default     = false
}

variable "site_bucket_name" {
  type        = string
  description = "globally-unique S3 bucket name for the site. Differs per environment because S3 bucket names are global."
}

variable "aws_profile" {
  type        = string
  description = "local AWS CLI profile name for provider to use. Differs per environment to allow for different credentials to be used in different environments."
}