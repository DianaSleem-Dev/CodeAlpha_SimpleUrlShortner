// create a mongoose model for the Url collection with fields shortCode and originalUrl.
//  Both fields are required and shortCode should be unique.
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  originalUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Url", urlSchema);