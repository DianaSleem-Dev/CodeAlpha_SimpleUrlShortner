const express = require("express");
const router = express.Router();
const Url = require("../models/Url");

// generate short code
function generateCode() {
  return Math.random().toString(36).substring(2, 8);
}

// POST /shorten
router.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortCode = generateCode();

    const newUrl = new Url({
      shortCode,
      originalUrl: url
    });

    await newUrl.save();

    res.json({
      shortUrl: `http://localhost:3000/${shortCode}`
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/history", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const urls = await Url.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Url.countDocuments();

    res.json({
      data: urls,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// GET /:code (redirect)
router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (!url) {
      return res.status(404).send("Not found");
    }

    res.redirect(url.originalUrl);

  } catch (error) {
    res.status(500).send("Server error");
  }
});
module.exports = router;