# Outputs exist so that things OUTSIDE Terraform (CI jobs, the frontend build,
# the browser tests) can discover values that only Terraform knows, instead of
# having those values hardcoded in two places and drifting apart.

# --- consumed by the deployment pipeline ---

output "site_url" {
  description = "Base URL a visitor (or a browser test) should hit for this environment. Prod uses the custom domain, test uses the CloudFront default domain."
  value       = var.use_custom_domain ? "https://${var.site_domain}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "visitor_count_api_url" {
  description = "Full invoke URL for the visitor counter endpoint, including the route. The frontend needs this at BUILD time because Next.js inlines NEXT_PUBLIC_* values into the static bundle."
  value       = "${aws_apigatewayv2_api.visitor_count_api.api_endpoint}/visitor-count"
}

output "site_bucket_name" {
  description = "S3 bucket the built site is synced into. Lets the deploy job stop hardcoding a bucket name per environment."
  value       = aws_s3_bucket.cloud_resume_challenge_bucket.id
}

output "cloudfront_distribution_id" {
  description = "Needed to invalidate the CDN cache after a deploy, so smoke tests exercise the new build instead of a cached old one."
  value       = aws_cloudfront_distribution.site.id
}

# --- diagnostic, for humans debugging an environment ---

output "cloudfront_domain_name" {
  description = "Raw CloudFront domain, independent of whether a custom domain is in use. Useful for debugging DNS and certificate issues in prod."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "current_account_id" {
  description = "Which AWS account this workspace is actually pointed at. Cheapest possible guard against applying to the wrong environment."
  value       = data.aws_caller_identity.current.account_id
}

output "gitlab_ci_deploy_role_arn" {
  description = "ARN of the IAM role GitLab CI assumes to deploy the site"
  value       = aws_iam_role.gitlab_ci_deploy.arn
}
