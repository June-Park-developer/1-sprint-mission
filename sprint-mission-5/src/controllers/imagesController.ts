import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  PUBLIC_PATH,
  STATIC_PATH,
} from '../lib/constants';
import { BadRequestError } from '../lib/errors/BadRequestError';
import { RequestHandler } from 'express';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../lib/s3client';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err);
    }

    cb(null, true);
  },
});

export const uploadImage: RequestHandler = async (req, res, next) => {
  if (!req.file) {
    return next(new BadRequestError('No file uploaded'));
  }
  const protocol = req.protocol;
  const host = req.get('host');
  let returnUrlPath = `${host}${STATIC_PATH}/${req.file.filename}`;
  if (process.env.NODE_ENV === 'production') {
    const fileStream = fs.createReadStream(req.file.path);

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: req.file.filename as string,
      Body: fileStream,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);

    try {
      await s3.send(command);
    } catch (error) {
      console.error('Error uploading object to S3', error);
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting local file', err);
      });
      next(error);
    }
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting local file', err);
    });
    returnUrlPath = `${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${req.file.filename}`;
  }

  const url = `${protocol}://${returnUrlPath}`;
  res.status(201).json({ url });
};
