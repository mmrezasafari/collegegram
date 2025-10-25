import { Client as MinioClient } from "minio";
import DotenvFlow from "dotenv-flow";
if (process.env.NODE_ENV !== 'production') {
  DotenvFlow.config()
}
export const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || "minio",
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});