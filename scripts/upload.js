import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {fromIni} from "@aws-sdk/credential-provider-ini";
import {readFileSync} from 'fs';

// Loading Credentials from ~/.aws/credentials
const config = {
    region: 'us-east-1',
    credentials: fromIni({profile: 'tutorials3'})
};

// Preparing Object conte to submit
const file = readFileSync('files/natural-wonders-1400924.jpg');
const putData = {
    Bucket: process.env.TUTORIAL_BUCKET,
    Key: 'photo.jpg',
    StorageClass: 'STANDARD',
    Body: file
};

const s3Client = new S3Client(config);
const response = await s3Client.send(new PutObjectCommand(putData));

console.log('response: ', response);
