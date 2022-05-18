const multer = require('multer');

// Initialize Multer Config for Uploading Files
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.originalUrl.includes('/api/auth/avatar/')) {
      callback(null, 'images/UserImage/Updated');
    } else {
      callback(null, 'images/ForumImages');
    };
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage: storage }).single('attachment');