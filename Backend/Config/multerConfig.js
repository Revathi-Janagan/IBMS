const multer = require("multer");

// Define the storage engine and destination for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profile_pic") {
      cb(null, "uploads/images/"); // Define the directory for image uploads
    } else if (file.fieldname === "document") {
      cb(null, "uploads/documents/"); // Define the directory for document uploads
    }
  },
  filename: function (req, file, cb) {
    // Define the naming convention for uploaded files (e.g., timestamp + originalname)
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Define the file filter functions for image and document uploads
const imageFileTypes = /jpeg|jpg|png|gif/;
const documentFileTypes = /pdf|docx|xlsx/;

const fileFilter = function (req, file, cb) {
  if (file.fieldname === "profile_pic") {
    if (imageFileTypes.test(file.originalname.toLowerCase()) && imageFileTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb("Error: Only image files with extensions jpeg, jpg, png, or gif are allowed.");
    }
  } else if (file.fieldname === "document") {
    if (documentFileTypes.test(file.originalname.toLowerCase()) && documentFileTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb("Error: Only PDF, Word (DOCX), and Excel (XLSX) files are allowed for documents.");
    }
  }
};

// Create the multer instance with the defined storage and file filter
const upload = multer({
  storage: storage,
  limits: {
    // Limit the file size (optional)
    fileSize: 1024 * 1024 * 15, // 15 MB limit (adjust as needed)
  },
  fileFilter: fileFilter, // Set the file filter function
});

module.exports = upload;
