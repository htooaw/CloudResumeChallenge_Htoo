resource "aws_iam_openid_connect_provider" "gitlab" {
  url = "https://gitlab.com"

  client_id_list = [
    "https://gitlab.com",
  ]

  thumbprint_list = [data.tls_certificate.gitlab.certificates[0].sha1_fingerprint]

  lifecycle {
    prevent_destroy = true
  }
}


resource "aws_iam_role" "gitlab_ci_deploy" {
  name                 = "gitlab_ci_deploy"
  assume_role_policy   = data.aws_iam_policy_document.gitlab_trust.json # the trust policy — answers "who can assume me?"
  max_session_duration = 7200

  lifecycle {
    prevent_destroy = true
  }

}

# Trust policy — uses sts:AssumeRoleWithWebIdentity, Federated principal, sub/aud conditions
data "aws_iam_policy_document" "gitlab_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.gitlab.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "gitlab.com:sub"
      values   = ["project_path:h4w1/cloudresumechallenge-haw:ref_type:branch:ref:main"]
    }

    condition {
      test     = "StringEquals"
      variable = "gitlab.com:aud"
      values   = ["https://gitlab.com"]
    }
  }
}


data "aws_iam_policy_document" "s3_deploy" {
  statement {
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.cloud_resume_challenge_bucket.arn]
  }

  statement {
    actions   = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.cloud_resume_challenge_bucket.arn}/*"]
  }

}

resource "aws_iam_policy" "s3_deploy" {
  name   = "s3_deploy"
  policy = data.aws_iam_policy_document.s3_deploy.json
}

resource "aws_iam_role_policy_attachment" "s3_deploy" {
  role       = aws_iam_role.gitlab_ci_deploy.name
  policy_arn = aws_iam_policy.s3_deploy.arn
}

resource "aws_iam_role_policy_attachment" "aws_resources_readonly" {
  role       = aws_iam_role.gitlab_ci_deploy.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

data "aws_iam_policy_document" "ci_deploy" {
  statement {
    sid    = "ServiceWritesForThisStack"
    effect = "Allow"
    actions = [
      "s3:*",
      "cloudfront:*",
      "acm:*",
      "route53:*",
      "route53domains:Get*",
      "dynamodb:*",
      "lambda:*",
      "apigateway:*",
      "cloudwatch:*",
      "logs:*",
      "sns:*",
      "ssm:*",
      "tag:*",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "IamForRolesAndPoliciesOnly"
    effect = "Allow"
    actions = [
      "iam:*Role*",
      "iam:*Policy*",
      "iam:*OpenIDConnectProvider*",
      "iam:PassRole",
      "iam:TagRole",
      "iam:UntagRole",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "DenyEscalationAndAccountLevelChanges"
    effect = "Deny"
    actions = [
      "iam:*User*",
      "iam:*Group*",
      "iam:*AccessKey*",
      "iam:*LoginProfile*",
      "iam:*SAMLProvider*",
      "iam:UpdateAccountPasswordPolicy",
      "organizations:*",
      "account:*",
      "aws-portal:*",
      "sso:*",
      "identitystore:*",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "ci_deploy" {
  name   = "gitlab_ci_deploy_writes"
  policy = data.aws_iam_policy_document.ci_deploy.json
}

resource "aws_iam_role_policy_attachment" "ci_deploy" {
  role       = aws_iam_role.gitlab_ci_deploy.name
  policy_arn = aws_iam_policy.ci_deploy.arn
}
