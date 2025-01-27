const mongoose = require("mongoose");

const userFileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  fileName: {
    type: String,
    required: true,
  },
  driveFileId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserFile", userFileSchema);
