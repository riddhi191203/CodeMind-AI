import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(js|jsx|ts|tsx|py|java|cpp|c|go|rs|php|txt)$/i;

    if (!allowedExtensions.test(file.originalname)) {
      return cb(new Error("Unsupported file type"));
    }

    cb(null, true);
  },
});

export default upload;
