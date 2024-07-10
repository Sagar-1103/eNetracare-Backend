import multer from "multer";
import {uploadsDir} from "../../index.js"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({storage});