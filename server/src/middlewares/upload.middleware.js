const multer = require('multer');

// Configure multer to store files in memory as Buffers.
// This allows us to upload them directly to Supabase Storage without writing to the disk.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
