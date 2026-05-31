
resource "aws_s3_bucket" "cloud_resume_challenge_bucket" {
  bucket = var.site_bucket_name
}

resource "aws_s3_bucket_public_access_block" "cloudfront_read_only" {
  bucket = aws_s3_bucket.cloud_resume_challenge_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

}

resource "aws_s3_bucket_policy" "cloudfront_read_only" {
  bucket = aws_s3_bucket.cloud_resume_challenge_bucket.id
  policy = data.aws_iam_policy_document.cloudfront_read_only.json

  depends_on = [aws_s3_bucket_public_access_block.cloudfront_read_only]
}

data "aws_iam_policy_document" "cloudfront_read_only" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.cloud_resume_challenge_bucket.arn}/*",
    ]
  }
}


