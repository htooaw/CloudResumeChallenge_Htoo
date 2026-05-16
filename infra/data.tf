data "aws_caller_identity" "current" {}


data "tls_certificate" "gitlab" {
  url = "https://gitlab.com"
}

output "current_account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "gitlab_ci_deploy_role_arn" {
  description = "ARN of the IAM role GitLab CI assumes to deploy the site"
  value       = aws_iam_role.gitlab_ci_deploy.arn
}