const express = require("express");
const router = express.Router();
const crawlSchedule = require("../crawl/dodo");
const crawlThoiKhoaBieu = require("../crawl/stu");
require("dotenv").config();

router.get("/dodo", async (req, res) => {
  try {
    const data = await crawlSchedule();
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi crawl:", err);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy lịch làm" });
  }
});

router.get("/stu", async (req, res) => {
  try {
    const data = await crawlThoiKhoaBieu(
      process.env.userstu,
      process.env.passstu
    );
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi crawl:", err);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy lịch làm" });
  }
});

module.exports = router;
