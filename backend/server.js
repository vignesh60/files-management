const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Google Drive API setup
const KEYFILEPATH = path.join(__dirname, "cred.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
const drive = google.drive({ version: "v3", auth });

// Upload file to Google Drive
app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const fileMetadata = { name: fileName };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    const { data } = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    fs.unlinkSync(filePath);
    res
      .status(200)
      .json({ message: "File uploaded successfully", fileId: data.id });
  } catch (error) {
    res.status(500).send("Error uploading file: " + error.message);
  }
});

// List files in Google Drive
app.get("/files", async (req, res) => {
  try {
    const { data } = await drive.files.list({
      pageSize: 50,
      fields: "files(id, name)",
    });
    res.status(200).json(data.files);
  } catch (error) {
    res.status(500).send("Error listing files: " + error.message);
  }
});

// Update file name in Google Drive
app.post("/update", async (req, res) => {
  const { fileId, newName } = req.body;

  try {
    await drive.files.update({
      fileId,
      resource: { name: newName },
    });

    res.status(200).send(`File renamed to ${newName}`);
  } catch (error) {
    res.status(500).send("Error updating file: " + error.message);
  }
});

// Delete file from Google Drive
app.delete("/delete", async (req, res) => {
  const { fileId } = req.body;

  try {
    await drive.files.delete({ fileId });
    res.status(200).send("File deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting file: " + error.message);
  }
});

// Start server
app.listen(5050, () => {
  console.log("Server running on port 5050");
});
