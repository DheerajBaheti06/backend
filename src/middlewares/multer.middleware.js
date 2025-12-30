import multer from "multer";

/**
 * Multer Disk Storage Configuration.
 * Files are temporarily stored in ./public/temp before being uploaded to Cloudinary.
 * They should be cleaned up by the controller/utils after processing.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
