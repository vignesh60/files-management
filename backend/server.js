const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const UserFile = require("./models/userFileModel");
const SECRET_KEY = "your_secret_key";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");

// MongoDB connection
mongoose.connect(
  "mongodb+srv://vigneshg984:codervicky@cluster0.rxfshw0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/filemanager"
);

// Google Drive API setup
const KEYFILEPATH = path.join(__dirname, "cred.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
const drive = google.drive({ version: "v3", auth });

// Upload file to Google Drive
/* app.post("/upload", upload.single("file"), async (req, res) => {
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
}); */

app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  // Extract token from headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token required." });
  }

  try {
    // Verify JWT token and extract user ID
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

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

    // Remove the temporary uploaded file
    fs.unlinkSync(filePath);

    // Store file information in MongoDB
    const newFile = new UserFile({
      userId,
      fileName,
      driveFileId: data.id, // Google Drive file ID
    });

    await newFile.save();

    res.status(200).json({
      message: "File uploaded successfully",
      fileId: data.id,
    });
  } catch (error) {
    res.status(500).send("Error uploading file: " + error.message);
  }
});

// List files in Google Drive
/* app.get("/files", async (req, res) => {
  try {
    const { data } = await drive.files.list({
      pageSize: 50,
      fields: "files(id, name)",
    });
    res.status(200).json(data.files);
  } catch (error) {
    res.status(500).send("Error listing files: " + error.message);
  }
}); */


app.get("/files", async (req, res) => {
  try {
    // Retrieve the token from the request header (assumes 'Authorization' header is being sent)
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).send("No token provided");
    }

    // Decode the token to get the user ID
    const decodedToken = jwt.verify(token, "your_secret_key"); // Replace 'your_secret_key' with your actual secret key
    const userId = decodedToken.id;

    // Fetch files specific to the user
    const userFiles = await UserFile.find({ userId: userId });

    console.log("User files:", userFiles);

    // Respond with the files
    res.status(200).json(userFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Error fetching files: " + error.message);
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
/* app.delete("/delete", async (req, res) => {
  const { fileId } = req.body;

  try {
    await drive.files.delete({ fileId });
    res.status(200).send("File deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting file: " + error.message);
  }
}); */


app.delete("/delete", async (req, res) => {
  const { fileId } = req.body; // The 'fileId' should be the Google Drive file ID

  try {
    // Step 1: Delete the file from Google Drive
    await drive.files.delete({ fileId });

    // Step 2: Delete the file record from MongoDB
    const fileRecord = await UserFile.findOneAndDelete({ driveFileId: fileId });

    if (!fileRecord) {
      return res.status(404).send("File not found in the database.");
    }

    res
      .status(200)
      .send("File deleted successfully from Google Drive and database.");
  } catch (error) {
    res.status(500).send("Error deleting file: " + error.message);
  }
});

app.use("/api/auth", authRoutes);

// Start server
app.listen(5050, () => {
  console.log("Server running on port 5050");
});
