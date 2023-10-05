const multer = require('multer');

// Define the storage engine and destination for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profile_pic') {
      cb(null, 'uploads/images/'); // Define the directory for image uploads
    } else if (file.fieldname === 'document') {
      cb(null, 'uploads/documents/'); // Define the directory for document uploads
    }
  },
  filename: function (req, file, cb) {
    // Define the naming convention for uploaded files (e.g., timestamp + originalname)
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Create the multer instance with the defined storage
const upload = multer({
  storage: storage,
  limits: {
    // Limit the file size (optional)
    fileSize: 1024 * 1024 * 15, // 15 MB limit (adjust as needed)
  },
  fileFilter: function (req, file, cb) {
    // Define a file filter to restrict the allowed file types (optional)
    if (file.fieldname === 'profile_pic') {
      const allowedFileTypes = /jpeg|jpg|png|gif/;
      const extname = allowedFileTypes.test(file.originalname.toLowerCase());
      const mimetype = allowedFileTypes.test(file.mimetype);
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb('Error: Only image files with extensions jpeg, jpg, png, or gif are allowed.');
      }
    } else if (file.fieldname === 'document') {
      const allowedFileTypes = /pdf|docx|xlsx/;
      const extname = allowedFileTypes.test(file.originalname.toLowerCase());
      const mimetype = allowedFileTypes.test(file.mimetype);
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb('Error: Only PDF, Word (DOCX), and Excel (XLSX) files are allowed for documents.');
      }
    }
  },
});

module.exports = upload;
