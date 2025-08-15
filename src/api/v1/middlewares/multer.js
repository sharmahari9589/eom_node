import multer, { diskStorage } from "multer";

const storage = diskStorage({
    destination: function(req, file, cb) {
        cb(null, './image/');
    },
    filename: function(req, file, cb) {
        cb(null, `${new Date().toDateString().replaceAll(" ","-")}_${new Date().getTime()}_${(file.originalname).replaceAll(" ","-")}`);
    },
});

const uploads = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

export default uploads;
