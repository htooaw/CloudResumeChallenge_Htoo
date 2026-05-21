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

  zone_id         = data.aws_route53_zone.main.zone_id
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