import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("lotion-30141921")

def delete_note_handler(event, context):
    body = json.loads(event["body"])

    id = body["id"]
    email = body["email"]

    try:
        res = table.delete_item(Key={
            "email": email,
            "id": id,
        })

        return{
            "statusCode": 200,
            "body": "success"
        }
    except Exception as exp:
        print(exp)
        return{
            "statusCode": 500,
            "body": json.dumps({"message": str(exp)})
        }