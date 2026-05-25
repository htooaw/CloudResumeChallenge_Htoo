import json
import boto3  # type: ignore
import urllib.request


ssm = boto3.client('ssm')
response = ssm.get_parameter(Name='/visitor_count/slack_webhook_url', WithDecryption=True)
webhook_url = response['Parameter']['Value']

def lambda_handler(event, context):
    try:
        sns_message = json.loads(event['Records'][0]['Sns']['Message'])
        alarm_name = sns_message['AlarmName']
        state = sns_message['NewStateValue']
        reason = sns_message['NewStateReason']

        slack_payload = {
            "text": f"🚨 *{alarm_name}* is in state *{state}*\n{reason}"
        }

        data = json.dumps(slack_payload).encode('utf-8')
        req = urllib.request.Request(webhook_url, data=data, headers={'Content-Type': 'application/json'})
        urllib.request.urlopen(req)  # ← THIS line was missing

        return {'statusCode': 200, 'body': json.dumps({'message': 'Notification sent'})}
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}

