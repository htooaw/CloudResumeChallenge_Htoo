terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.44.0"
    }
  }
}

provider "aws" {
  region  = "ap-southeast-1"
  profile = "haw-sandbox"
}

provider "aws" {
  region  = "us-east-1"
  profile = "haw-sandbox"
  alias   = "us-east-1"
}


