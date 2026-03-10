"use server"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto"

const accessKeyId = process.env.AWS_S3_ACCESS_KEY
const accessKeySecret = process.env.AWS_S3_ACCESS_SECRET
const s3Bucket = process.env.AWS_S3_BUCKET
const s3Folder = process.env.AWS_S3_FOLDER

if (!accessKeyId || !accessKeySecret || !s3Bucket || !s3Folder) throw new Error("Missing S3 Credentials")

export const getSignedUri = async (fileName: string) => {
    if (!fileName.toLocaleLowerCase().endsWith(".csv")) throw new Error("Only CSV's allowed")

    const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const randomId = crypto.randomUUID();
    const key = `${s3Folder}/${randomId}-${safeName}`;

    const client = new S3Client({
        region: "us-east-1",
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: accessKeySecret
        }
    });
    const command = new PutObjectCommand({
        Bucket: s3Bucket,
        Key: key,
        ContentType: "text/csv"
    });
    const url = await getSignedUrl(client, command, { expiresIn: 900})
    return { url, key}
}