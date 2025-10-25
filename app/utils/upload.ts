import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import multer from "multer";
import { Readable } from "stream";
import { Parser } from "json2csv";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const deleteFileIfExists = async (bucket: string, key: string) => {
  try {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (err: any) {
    if (err.name !== "NoSuchKey") {
      console.error("Error deleting the file:", err.message);
    } else {
      console.log("File not found, proceeding with upload.");
    }
  }
};

const multerS3Storage = multer.memoryStorage();
export const upload = multer({ storage: multerS3Storage });

export const s3UploadMiddleware = async (
  req: any,
  res: any,
  next: Function,
) => {
  if (!req.file) return next();

  const bucket = process.env.AWS_BUCKET!;
  const key = `carvix/${Date.now()}_${req.file.originalname.replace(/ /g, "_")}`;

  await deleteFileIfExists(bucket, key);

  const stream = Readable.from(req.file.buffer);
  const uploadParams = {
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: stream,
    },
  };

  try {
    const uploader = new Upload(uploadParams);
    await uploader.done();
    req.file.location = `${process.env.AWS_CDN}/${key}`;
    next();
  } catch (error: any) {
    console.error("Error uploading file:", error.message);
    next(error);
  }
};

export const s3MultiUploadMiddleware = async (
  req: any,
  res: any,
  next: Function,
) => {
  if (!req.files || req.files.length === 0) return next();

  const bucket = process.env.AWS_BUCKET!;
  const uploadPromises = req.files.map(async (file: any) => {
    const key = `carvix/${Date.now()}_${file.originalname.replace(/ /g, "_")}`;

    await deleteFileIfExists(bucket, key);
    const stream = Readable.from(file.buffer);

    const uploadParams = {
      client: s3Client,
      params: { Bucket: bucket, Key: key, Body: stream },
    };

    const uploader = new Upload(uploadParams);
    await uploader.done();
    return `${process.env.AWS_CDN}/${key}`;
  });

  try {
    const uploadedFiles = await Promise.all(uploadPromises);
    req.files = uploadedFiles;
    next();
  } catch (error) {
    next(error);
  }
};

export const s3UploadFile = async (buffer: Buffer, fileName: string) => {
  const bucket = process.env.AWS_BUCKET!;
  const key = `carvix/${Date.now()}_${fileName}`;

  const stream = Readable.from(buffer);

  const uploadParams = {
    client: s3Client,
    params: { Bucket: bucket, Key: key, Body: stream },
  };

  const uploader = new Upload(uploadParams);
  return await uploader.done();
};

export const generateCsv = async (
  list: Record<string, any>[],
  fileName: string,
) => {
  if (!list || list.length === 0) return "";

  const fields = Object.keys(list[0]);
  const csv = new Parser({ fields });
  const buffer = Buffer.from(csv.parse(list), "utf-8");

  const uploadRes = await s3UploadFile(buffer, fileName);
  return `${process.env.AWS_CDN}/${uploadRes.Key}`;
};

export const uploadPdfToS3 = async (buffer: Buffer, originalname: string) => {
  try {
    const uploadRes = await s3UploadFile(buffer, originalname);
    return `${process.env.AWS_CDN}/${uploadRes.Key}`;
  } catch (error) {
    console.error("Error uploading PDF to S3:", error);
    throw new Error("Failed to upload PDF");
  }
};
