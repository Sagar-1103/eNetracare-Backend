import multer from "multer";
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const uploadsDir = path.join(os.tmpdir(), 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({storage});