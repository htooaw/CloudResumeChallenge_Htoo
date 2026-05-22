import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('crc_visitor_count')

def lambda_handler(event, context):
    try:
        response = table.update_item(
            Key={'id': 'main'},
            UpdateExpression='ADD #count :inc',
            ExpressionAttributeNames={'#count': 'count'},
            ExpressionAttributeValues={':inc': 1},
            ReturnValues='UPDATED_NEW'
        )
# Convert Decimal to int because json.dumps can't serialize Decimal natively
        
        new_count = int(response['Attributes']['count'])
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'https://htooaungwin.com',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'count': new_count})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': 'https://htooaungwin.com',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': str(e)})
        }
