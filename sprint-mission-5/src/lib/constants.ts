import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envFilePath });

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';
export const JWT_SECRET = process.env.JWT_SECRET;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
