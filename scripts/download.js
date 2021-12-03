import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {fromIni} from "@aws-sdk/credential-provider-ini";
import {writeFileSync} from 'fs';

// Loading Credentials from ~/.aws/credentials
const config = {
    region: 'us-east-1',
    credentials: fromIni({profile: 'tutorials3'})
};

// Preparing Object conte to submit
const downloadData = {
    Bucket: process.env.TUTORIAL_BUCKET,
    Key: 'photo.jpg'
};

async function stream2buffer(stream) {
    return new Promise((resolve, reject) => {
        const _buf = [];
        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));
    });
}

const s3Client = new S3Client(config);
const response = await s3Client.send(new GetObjectCommand(downloadData));

writeFileSync('downloads/photo.jpg', await stream2buffer(response.Body));

console.log('Arquivo salvo em downloads/photo.jpg');
