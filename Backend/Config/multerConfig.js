const multer = require('multer');
const path = require('path');

// Configure storage for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/')); // Specify the directory for image uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Define how image filenames should be constructed
  },
});

// Configure storage for document uploads
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/documents')); // Specify the directory for document uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Define how document filenames should be constructed
  },
});

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
