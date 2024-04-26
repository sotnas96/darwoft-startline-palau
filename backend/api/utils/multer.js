const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, path.join(__dirname,'../../public/uploads/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const uploadFile = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
            const allowExt = ['.jpg', '.jpeg', '.png']
            const ext = path.extname(file.originalname).toLowerCase();
            if (allowExt.includes(ext)) return cb(null, true)
            return cb(null, false);
    },
    // limits: { fileSize: 1024 * 1024 } 
});
module.exports = uploadFile;