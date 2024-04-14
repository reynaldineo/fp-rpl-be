import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import multer from "multer";
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  storage: multer.diskStorage({}),
});
