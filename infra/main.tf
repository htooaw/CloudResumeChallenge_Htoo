
resource "aws_s3_bucket" "cloud_resume_challenge_bucket" {
  bucket = "h4wops.com"
}


resource "aws_s3_bucket_website_configuration" "cloud_resume_challenge_website" {
  bucket = aws_s3_bucket.cloud_resume_challenge_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }

}


resource "aws_s3_bucket_public_access_block" "cloud_resume_challenge_public_access" {
  bucket = aws_s3_bucket.cloud_resume_challenge_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

}

resource "aws_s3_bucket_policy" "allow_access_from_public" {
  bucket = aws_s3_bucket.cloud_resume_challenge_bucket.id
  policy = data.aws_iam_policy_document.allow_access_from_public.json

  depends_on = [aws_s3_bucket_public_access_block.cloud_resume_challenge_public_access]
}

data "aws_iam_policy_document" "allow_access_from_public" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.cloud_resume_challenge_bucket.arn}/*",
    ]
  }
}