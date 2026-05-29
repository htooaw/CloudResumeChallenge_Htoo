terraform {
  cloud {
    organization = "haw-org"
    workspaces {
      tags = ["cloudresumechallenge-haw"]
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.44.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
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
  alias   = "us_east_1"
}


