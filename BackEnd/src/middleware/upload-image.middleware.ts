import multer, { FileFilterCallback } from 'multer';
import path from 'path';

function checkFileFilter(file: Express.Multer.File, cb: FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|svg|apng/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(null, false);
    cb(new Error("فرمت فایل پشتیبانی نمی‌شود"))
  }
}
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4000000 }, // 4MB
  fileFilter: (req, file, cb) => checkFileFilter(file, cb),
})



