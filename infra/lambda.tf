data "aws_iam_policy_document" "lambda_trust" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole",
    ]
  }
}

resource "aws_iam_role" "visitor_count_lambda" {
  name               = "visitor_count_lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust.json
}

data "aws_iam_policy_document" "lambda_dynamodb_access" {
  statement {

    actions = [
      "dynamodb:UpdateItem",
    ]

    resources = [
      aws_dynamodb_table.crc_visitor_count.arn,
    ]
  }
}

resource "aws_iam_policy" "lambda_dynamodb_access" {
  name   = "lambda_dynamodb_access"
  policy = data.aws_iam_policy_document.lambda_dynamodb_access.json
}

resource "aws_iam_role_policy_attachment" "visitor_count_lambda_dynamodb_access" {
  role       = aws_iam_role.visitor_count_lambda.name
  policy_arn = aws_iam_policy.lambda_dynamodb_access.arn
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.visitor_count_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "visitor_count_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/visitor_count"
  output_path = "${path.module}/visitor_count_lambda.zip"
  excludes    = ["tests", "tests/*", ".venv", ".venv/*", "__pycache__", "__pycache__/*", "requirements-dev.txt", ".pytest_cache", ".pytest_cache/*"]

}

resource "aws_lambda_function" "visitor_count" {
  function_name    = "visitor_count"
  role             = aws_iam_role.visitor_count_lambda.arn
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.12"
  filename         = data.archive_file.visitor_count_lambda_zip.output_path
  source_code_hash = data.archive_file.visitor_count_lambda_zip.output_base64sha256
}