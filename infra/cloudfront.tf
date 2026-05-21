resource "aws_acm_certificate" "site" {
  provider                  = aws.us_east_1
  domain_name               = "htooaungwin.com"
  subject_alternative_names = ["www.htooaungwin.com"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}


data "aws_route53_zone" "site" {
  name         = "htooaungwin.com"
  private_zone = false
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id         = data.aws_route53_zone.site.zone_id
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  ttl             = 60
  allow_overwrite = true

}

resource "aws_acm_certificate_validation" "site" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "htooaungwin_cdn"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "site" {
  origin {
    domain_name              = aws_s3_bucket.cloud_resume_challenge_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
    origin_id                = "s3-h4wops.com"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "htooaungwin.com portfolio"
  default_root_object = "index.html"

  aliases = ["htooaungwin.com", "www.htooaungwin.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-h4wops.com"
    compress         = true

    viewer_protocol_policy = "redirect-to-https"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # AWS-managed: CachingOptimized
  }


  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

resource "aws_route53_record" "site" {

  for_each = toset(["htooaungwin.com", "www.htooaungwin.com"])

  zone_id = data.aws_route53_zone.site.zone_id

  name = each.value
  type = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}