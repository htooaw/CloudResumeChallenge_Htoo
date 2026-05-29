# Multi-Environment Refactor Notes

## Variables to introduce

- `site_domain` (string) — custom domain name (e.g. "htooaungwin.com"). Empty in test.
- `use_custom_domain` (bool) — whether to provision Route53/ACM/aliases. True in prod, false in test.
- `site_bucket_name` (string) — globally-unique S3 bucket name. Differs per env.

## Per-file refactor

### infra/cloudfront.tf

**Resources that need `count = var.use_custom_domain ? 1 : 0`:**
- aws_acm_certificate.site
- data.aws_route53_zone.site
- aws_route53_record.cert_validation
- aws_acm_certificate_validation.site
- aws_route53_record.site

**Domain references to replace with var.site_domain:**
- aws_acm_certificate.site.domain_name
- aws_acm_certificate.site.subject_alternative_names
- data.aws_route53_zone.site.name
- aws_cloudfront_distribution.site.comment
- aws_cloudfront_distribution.site.aliases (conditional — empty list in test)
- aws_route53_record.site.for_each set

**Bucket name references:**
- aws_cloudfront_distribution.site.origin.origin_id
- aws_cloudfront_distribution.site.default_cache_behavior.target_origin_id

**Viewer certificate block:**
- Needs conditional logic — ACM cert in prod, cloudfront_default_certificate in test
- Decide pattern when writing

### infra/main.tf

**Bucket name references (use var.site_bucket_name):**
- aws_s3_bucket.cloud_resume_challenge_bucket.bucket

**Resources that stay env-neutral (no changes):**
- aws_s3_bucket_public_access_block.cloudfront_read_only
- aws_s3_bucket_policy.cloudfront_read_only
- data.aws_iam_policy_document.cloudfront_read_only

**Cleanup (not refactor):**
- Remove commented-out aws_s3_bucket_website_configuration block

### infra/variables.tf

Existing variables (keep as-is, set per-workspace in HCP):
- alarm_notification_email
- slack_webhook_url

To add:
- site_domain (string, default "")
- use_custom_domain (bool, default false)
- site_bucket_name (string)

### infra/api_gateway.tf

**CORS allow_origins:**
- Currently hardcoded "https://htooaungwin.com"
- Becomes conditional: var.site_domain in prod, CloudFront default URL in test
- Decide exact pattern when writing (lean: ternary based on var.use_custom_domain)

**Env-neutral (no changes):**
- API name, integration, route, stage, lambda permission

### infra/dynamodb.tf
- Env-neutral, no changes needed

### infra/lambda.tf
- Env-neutral, no changes needed
- Minor: archive_file excludes line has odd indentation (cosmetic)

### infra/data.tf
- Env-neutral, no changes needed
- Note for Pattern A: OIDC trust may need extension for two accounts later

### infra/monitoring.tf

**Mostly env-neutral. All resources scoped per-account, no name collisions.**
**Variable references already in place: alarm_notification_email, slack_webhook_url.**

Decision deferred: do we want full monitoring in test, or stub it out?
Lean: monitoring exists in both, webhook value differs per workspace (test points at /dev/null or a test channel).

### infra/oidc.tf

**No tonight changes. Env-neutral resources, references use Terraform refs.**

**Future (Pattern A pipeline):** trust policy condition currently allows only main branch.
For multi-env CI:
- Test workspace's GitLab role should trust MR/PR refs
- Prod workspace's GitLab role should trust main only
- Each workspace gets its own gitlab_ci_deploy role with appropriate trust

### infra/provider.tf

**Real fix needed:**
- `profile = "haw-sandbox"` hardcoded in both provider blocks
- Replace with `profile = var.aws_profile`
- Set per-workspace in HCP: prod → "haw-sandbox", test → "haw-test"

**Future (Pattern A):** remove `profile` lines entirely. CI provides credentials via env vars / OIDC.