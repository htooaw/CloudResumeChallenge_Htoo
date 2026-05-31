resource "aws_apigatewayv2_api" "visitor_count_api" {
  name          = "visitor_count_api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.use_custom_domain ? ["https://${var.site_domain}"] : ["https://${aws_cloudfront_distribution.site.domain_name}"]
    allow_methods = ["GET", "OPTIONS"]
    allow_headers = ["content-type"]
  }
}

resource "aws_apigatewayv2_integration" "visitor_count_lambda_integration" {
  api_id                 = aws_apigatewayv2_api.visitor_count_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.visitor_count.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "visitor_count_route" {
  api_id    = aws_apigatewayv2_api.visitor_count_api.id
  route_key = "GET /visitor-count"
  target    = "integrations/${aws_apigatewayv2_integration.visitor_count_lambda_integration.id}"
}



resource "aws_apigatewayv2_stage" "visitor_count_stage" {
  api_id      = aws_apigatewayv2_api.visitor_count_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigateway_invoke_visitor_count_lambda" {
  statement_id  = "AllowAPIGatewayInvokeVisitorCountLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.visitor_count.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.visitor_count_api.execution_arn}/*/*"
}