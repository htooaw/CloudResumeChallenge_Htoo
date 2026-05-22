resource "aws_dynamodb_table" "crc_visitor_count" {
  name         = "crc_visitor_count"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}