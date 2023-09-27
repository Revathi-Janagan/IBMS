const multer = require('multer');

// Configure storage for image uploads
const imageStorage = multer.memoryStorage();

// Configure storage for document uploads
const documentStorage = multer.memoryStorage();

// Configure file filter for images
const imageFileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
  }
};

// Configure file filter for documents (PDF, DOCX, XLSX)
const documentFileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word (DOCX), and Excel (XLSX) files are allowed.'), false);
  }
};

// Create Multer instances with the configurations
const uploadImage = multer({ storage: imageStorage, fileFilter: imageFileFilter });
const uploadDocument = multer({ storage: documentStorage, fileFilter: documentFileFilter });

module.exports = { uploadImage, uploadDocument };
