const connection = require("../../Helper/db");

module.exports = (req, res) => {
  // Assuming you receive the file ID in the request
  const fileId = req.params.id; // Adjust this according to your API route

  // Implement the logic to delete the file from your database
  const deleteFileSQL = `
    DELETE FROM uploadedfiles
    WHERE file_id = ?;
  `;

  connection.query(deleteFileSQL, fileId, (err, result) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    // Check if any file was deleted
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "File not found" });
    }

    // File deleted successfully
    res.status(200).send({ message: "File deleted successfully",fileId:fileId });
  });
};
