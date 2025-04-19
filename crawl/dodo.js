const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
require("dotenv").config();

async function crawlSchedule() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto("https://auth.dodois.com/account/login", {
    waitUntil: "networkidle0",
  });

  await page.type("#Username", process.env.userdodo, { delay: 100 });
  await page.type("#Password", process.env.passdodo, { delay: 100 });
  await page.select("#CountryCode_dodopizza", "Vn");

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  await page.goto("https://app.dodois.com/", { waitUntil: "networkidle0" });

  await page.waitForSelector('a[href="https://personal.dodopizza.vn/"]');
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('a[href="https://personal.dodopizza.vn/"]'),
  ]);

  await page.goto("https://personal.dodopizza.vn/Schedule/Schedule", {
    waitUntil: "networkidle0",
  });

  const $ = cheerio.load(await page.content());
  const result = [];

  $("div.private-block").each((i, el) => {
    const $block = $(el);
    const date = $block.attr("data-unitdate"); // ví dụ: "2025-04-18"
    const time = $block.find(".private-block-header").text().trim(); // ví dụ: "07:00 - 15:00"
    const location = $block.find(".private-block-body div").eq(0).text().trim();
    const position = $block.find(".private-block-body div").eq(1).text().trim();

   const timeRange = time.replace(/–|—/g, "-");
    const [startTime, endTime] = timeRange.split("-").map((t) => {
      const [hour, minute] = t.trim().split(":");
      return `${hour.padStart(2, "0")}`;
    });
        const isoDate = date.split(" ")[0].split("/");
    const res = `${isoDate[2]}-${isoDate[0]}-${isoDate[1]}`;
    
    const start = `${res}T${startTime}:00:00`;
    const end = `${res}T${endTime}:00:00`;
    result.push({ date, start, end, location, position });
  });

  await browser.close();
  return result;
}

module.exports = crawlSchedule;
