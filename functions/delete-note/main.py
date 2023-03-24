import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("notes-30141921")

def delete_note_handler(event, context):
    email = event["queryStringParameters"]["email"]
    id = event["queryStringParameters"]["id"]

    try:
        table.delete_item(Key={
            "email": email,
            "id": id,
        })
        res = table.query(KeyConditionExpression=Key("eamil").eq(email))
        return{
            "statusCode": 200,
            "body": "success"
        }
    except Exception:
        print(Exception)
        return{
            "statusCode": 500,
            "body": json.dumps({"message": str(Exception)})
        }