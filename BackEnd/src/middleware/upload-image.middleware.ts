import multer, { FileFilterCallback, MulterError } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

function checkFileFilter(file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        cb(null, true);
    } else {
        cb(null,false);
        cb(new Error("فرمت فایل پشتیبانی نمی‌شود"))
    }
}
export const upload = multer({
    storage:storage,
    limits: { fileSize: 4000000}, // 4MB
    fileFilter: (req, file, cb) => checkFileFilter(file , cb),
})