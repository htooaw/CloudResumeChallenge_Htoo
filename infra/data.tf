data "aws_caller_identity" "current" {}


data "tls_certificate" "gitlab" {
  url = "https://gitlab.com"
}
