import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config(); // <-- REQUIRED

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI missing in .env");
  throw new Error("MONGO_URI not found");
}

// --------------------------------------------
// GridFS bucket for downloading files
// --------------------------------------------
export let gridfsBucket;

mongoose.connection.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
});

// --------------------------------------------
// Multer GridFS Storage Engine
// --------------------------------------------
const storage = new GridFsStorage({
  url: mongoURI, // <-- this MUST NOT be undefined
  file: (req, file) => {
    return {
      bucketName: "uploads", // creates uploads.files + uploads.chunks
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

// --------------------------------------------
// Upload middleware
// --------------------------------------------
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF and DOCX files allowed"));
    }

    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
