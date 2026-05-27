import json
import os
import sys

import boto3
import pytest
from moto import mock_aws

# Add the parent directory to the path so we can import lambda_function
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


@pytest.fixture
def dynamodb_table():
    """Create a mock DynamoDB table for the duration of one test."""
    with mock_aws():
        dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-1')
        table = dynamodb.create_table(
            TableName='crc_visitor_count',
            KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
            BillingMode='PAY_PER_REQUEST',
        )
        table.wait_until_exists()
        yield table


def test_happy_path(dynamodb_table):
    # Import inside the test so the mock is active when boto3 client is created
    from lambda_function import lambda_handler

    response = lambda_handler({}, None)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'count' in body
    assert body['count'] == 1   # First invocation, count should be 1


def test_count_increments(dynamodb_table):
    from lambda_function import lambda_handler

    first = lambda_handler({}, None)
    second = lambda_handler({}, None)

    first_count = json.loads(first['body'])['count']
    second_count = json.loads(second['body'])['count']

    assert second_count == first_count + 1


def test_error_when_table_missing():
    """If the table doesn't exist, the handler should return 500."""
    with mock_aws():
        # Don't create the table — let the call fail
        from lambda_function import lambda_handler

        response = lambda_handler({}, None)

        assert response['statusCode'] == 500
        body = json.loads(response['body'])
        assert 'error' in body