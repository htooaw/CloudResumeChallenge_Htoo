resource "aws_acm_certificate" "site" {
  count                     = var.use_custom_domain ? 1 : 0
  provider                  = aws.us_east_1
  domain_name               = var.site_domain
  subject_alternative_names = ["www.${var.site_domain}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}


data "aws_route53_zone" "site" {
  count        = var.use_custom_domain ? 1 : 0
  name         = var.site_domain
  private_zone = false
}

resource "aws_route53_record" "cert_validation" {
  for_each = var.use_custom_domain ? {
    for dvo in aws_acm_certificate.site[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  zone_id         = data.aws_route53_zone.site[0].zone_id
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  ttl             = 60
  allow_overwrite = true

}

resource "aws_acm_certificate_validation" "site" {
  count                   = var.use_custom_domain ? 1 : 0
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site[0].arn
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
    origin_id                = "s3-${var.site_bucket_name}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.site_domain} portfolio"
  default_root_object = "index.html"

  aliases = var.use_custom_domain ? [var.site_domain, "www.${var.site_domain}"] : []
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-${var.site_bucket_name}"
    compress         = true

    viewer_protocol_policy = "redirect-to-https"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # AWS-managed: CachingOptimized

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }


  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  dynamic "viewer_certificate" {
    for_each = var.use_custom_domain ? [1] : []
    content {
      acm_certificate_arn      = aws_acm_certificate_validation.site[0].certificate_arn
      ssl_support_method       = "sni-only"
      minimum_protocol_version = "TLSv1.2_2021"
    }
  }

  dynamic "viewer_certificate" {
    for_each = var.use_custom_domain ? [] : [1]
    content {
      cloudfront_default_certificate = true
    }
  }


  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }
}

resource "aws_route53_record" "site" {

  for_each = var.use_custom_domain ? toset([var.site_domain, "www.${var.site_domain}"]) : toset([])

  zone_id = data.aws_route53_zone.site[0].zone_id

  name = each.value
  type = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "url-rewrite"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOF

    function handler(event) {
  var request = event.request;
  var uri = request.uri;
  
  // Rule 1: trailing slash
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  }
  // Rule 2: no extension, no trailing slash
  else if (!uri.includes('.')) {
    request.uri = uri + '/index.html';
  }
  // Rule 3: has extension, leave alone (implicit)
  
  return request;
}
EOF
}

