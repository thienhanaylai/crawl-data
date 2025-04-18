const axios = require("axios");
const cheerio = require("cheerio");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const tietToTime = {
  1: ["07:00", "07:50"],
  2: ["07:50", "08:40"],
  3: ["08:40", "09:30"],
  4: ["09:35", "10:25"],
  5: ["10:25", "11:15"],
  6: ["11:15", "12:05"],
  7: ["12:35", "13:25"],
  8: ["13:25", "14:15"],
  9: ["14:15", "15:05"],
  10: ["15:10", "16:00"],
  11: ["16:00", "16:50"],
  12: ["16:50", "17:40"],
  13: ["17:45", "18:35"],
  14: ["18:35", "19:25"],
  15: ["19:25", "20:15"],
};

// Mảng tuần lấy từ HTML
const weekList = [
  "Tuần 24 [Từ 10/02/2025 -- Đến 16/02/2025]",
  "Tuần 25 [Từ 17/02/2025 -- Đến 23/02/2025]",
  "Tuần 26 [Từ 24/02/2025 -- Đến 02/03/2025]",
  "Tuần 27 [Từ 03/03/2025 -- Đến 09/03/2025]",
  "Tuần 28 [Từ 10/03/2025 -- Đến 16/03/2025]",
  "Tuần 29 [Từ 17/03/2025 -- Đến 23/03/2025]",
  "Tuần 30 [Từ 24/03/2025 -- Đến 30/03/2025]",
  "Tuần 31 [Từ 31/03/2025 -- Đến 06/04/2025]",
  "Tuần 32 [Từ 07/04/2025 -- Đến 13/04/2025]",
  "Tuần 33 [Từ 14/04/2025 -- Đến 20/04/2025]",
  "Tuần 34 [Từ 21/04/2025 -- Đến 27/04/2025]",
  "Tuần 35 [Từ 28/04/2025 -- Đến 04/05/2025]",
  "Tuần 36 [Từ 05/05/2025 -- Đến 11/05/2025]",
  "Tuần 37 [Từ 12/05/2025 -- Đến 18/05/2025]",
  "Tuần 38 [Từ 19/05/2025 -- Đến 25/05/2025]",
  "Tuần 39 [Từ 26/05/2025 -- Đến 01/06/2025]",
  "Tuần 40 [Từ 02/06/2025 -- Đến 08/06/2025]",
  "Tuần 41 [Từ 09/06/2025 -- Đến 15/06/2025]",
  "Tuần 42 [Từ 16/06/2025 -- Đến 22/06/2025]",
  "Tuần 43 [Từ 23/06/2025 -- Đến 29/06/2025]",
  "Tuần 44 [Từ 30/06/2025 -- Đến 06/07/2025]",
  "Tuần 45 [Từ 07/07/2025 -- Đến 13/07/2025]",
  "Tuần 46 [Từ 14/07/2025 -- Đến 20/07/2025]",
  "Tuần 47 [Từ 21/07/2025 -- Đến 27/07/2025]",
  "Tuần 48 [Từ 28/07/2025 -- Đến 03/08/2025]",
  "Tuần 49 [Từ 04/08/2025 -- Đến 10/08/2025]",
  "Tuần 50 [Từ 11/08/2025 -- Đến 17/08/2025]",
  "Tuần 51 [Từ 18/08/2025 -- Đến 24/08/2025]",
  "Tuần 52 [Từ 25/08/2025 -- Đến 31/08/2025]",
  "Tuần 53 [Từ 01/09/2025 -- Đến 07/09/2025]",
  "Tuần 54 [Từ 08/09/2025 -- Đến 14/09/2025]",
  "Tuần 55 [Từ 15/09/2025 -- Đến 21/09/2025]",
  "Tuần 56 [Từ 22/09/2025 -- Đến 28/09/2025]",
  "Tuần 57 [Từ 29/09/2025 -- Đến 05/10/2025]",
  "Tuần 58 [Từ 06/10/2025 -- Đến 12/10/2025]",
  "Tuần 59 [Từ 13/10/2025 -- Đến 19/10/2025]",
  "Tuần 60 [Từ 20/10/2025 -- Đến 26/10/2025]",
  "Tuần 61 [Từ 27/10/2025 -- Đến 02/11/2025]",
  "Tuần 62 [Từ 03/11/2025 -- Đến 09/11/2025]",
  "Tuần 63 [Từ 10/11/2025 -- Đến 16/11/2025]",
  "Tuần 64 [Từ 17/11/2025 -- Đến 23/11/2025]",
  "Tuần 65 [Từ 24/11/2025 -- Đến 30/11/2025]",
  "Tuần 66 [Từ 01/12/2025 -- Đến 07/12/2025]",
  "Tuần 67 [Từ 08/12/2025 -- Đến 14/12/2025]",
  "Tuần 68 [Từ 15/12/2025 -- Đến 21/12/2025]",
  "Tuần 69 [Từ 22/12/2025 -- Đến 28/12/2025]",
  "Tuần 70 [Từ 29/12/2025 -- Đến 04/01/2026]",
  "Tuần 71 [Từ 05/01/2026 -- Đến 11/01/2026]",
  "Tuần 72 [Từ 12/01/2026 -- Đến 18/01/2026]",
  "Tuần 73 [Từ 19/01/2026 -- Đến 25/01/2026]",
  "Tuần 74 [Từ 26/01/2026 -- Đến 01/02/2026]",
  "Tuần 75 [Từ 02/02/2026 -- Đến 08/02/2026]",
];

function getDateFromWeekAndDay(weekNumber, weekday, weekList) {
  const weekStr = weekList.find((week) => week.includes(`Tuần ${weekNumber} `));
  if (!weekStr) return null;

  const match = weekStr.match(
    /Từ (\d{2}\/\d{2}\/\d{4}) -- Đến (\d{2}\/\d{2}\/\d{4})/
  );
  if (!match) return null;

  const [_, startDateStr] = match;
  const [day, month, year] = startDateStr.split("/").map(Number);
  const startDate = new Date(year, month - 1, day);

  // weekday: 1 = Thứ 2, 7 = Chủ nhật
  const targetDate = new Date(startDate);
  targetDate.setDate(startDate.getDate() + (weekday - 1));

  return targetDate.toISOString().split("T")[0]; // Trả về định dạng yyyy-mm-dd
}

function convertThuToNumber(thuStr) {
  const mapping = {
    "Thứ Hai": 2,
    "Thứ Ba": 3,
    "Thứ Tư": 4,
    "Thứ Năm": 5,
    "Thứ Sáu": 6,
    "Thứ Bảy": 7,
    "Chủ nhật": 8, // hoặc 8 nếu bạn muốn là cuối tuần
  };

  return mapping[thuStr.trim()] || null; // trả về null nếu không khớp
}

function getTimeRange(tietBatDau, soTiet) {
  const start = parseInt(tietBatDau, 10);
  const duration = parseInt(soTiet, 10);
  const end = start + duration - 1;
  const startTime = tietToTime[start]?.[0];
  const endTime = tietToTime[end]?.[1];
  return startTime && endTime ? `${startTime} - ${endTime}` : "Không xác định";
}

async function crawlThoiKhoaBieu(username, password) {
  const loginUrl = "http://daotao1.stu.edu.vn/default.aspx";
  const tkbUrl =
    "http://daotao1.stu.edu.vn/default.aspx?page=thoikhoabieu&sta=0";

  try {
    // B1: Lấy VIEWSTATE và các hidden inputs từ trang đăng nhập
    const res = await client.get(loginUrl);
    const $ = cheerio.load(res.data);

    const viewState = $("#__VIEWSTATE").val();
    const eventValidation = $("#__EVENTVALIDATION").val();

    // B2: Gửi POST để đăng nhập
    const postData = new URLSearchParams({
      __VIEWSTATE: viewState,
      __EVENTVALIDATION: eventValidation,
      ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: username,
      ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: password,
      ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: "Đăng nhập",
    });

    const loginRes = await client.post(loginUrl, postData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!loginRes.data.includes("ctl00_Header1_Logout1_lbtnLogOut")) {
      console.log("❌ Đăng nhập thất bại.");
      return;
    }

    //console.log("✅ Đăng nhập thành công!");

    // B3: Truy cập trang thời khóa biểu
    const tkbPage = await client.get(tkbUrl);
   // fs.writeFileSync("test.html", tkbPage.data, "utf-8");
    /*
    const viewStateTkb = $$("input[name='__VIEWSTATE']").val();
    const eventValidationTkb = $$("input[name='__EVENTVALIDATION']").val();
    const viewStateGenerator = $$("input[name='__VIEWSTATEGENERATOR']").val();
    
    // Ví dụ chọn tuần cụ thể:
    const selectedWeek = weekList.find((week) =>
      week.includes(`Tuần ${weekValue}`)
    );
    
    // B4: Gửi POST để chọn tuần
    const tkbPostData = new URLSearchParams({
      __EVENTTARGET: "ctl00$ContentPlaceHolder1$ctl00$ddlTuan",
      __EVENTARGUMENT: "",
      __LASTFOCUS: "",
      __VIEWSTATE: viewStateTkb,
      __EVENTVALIDATION: eventValidationTkb,
      __VIEWSTATEGENERATOR: viewStateGenerator,
      ctl00$ContentPlaceHolder1$ctl00$ddlTuan: selectedWeek,
    });
    
    const tkbRes = await client.post(tkbUrl, tkbPostData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    */
    const $$$ = cheerio.load(tkbPage.data);
    const table = $$$(
      "table[id$='ctl00_ContentPlaceHolder1_ctl00_Table1']"
    ).first();

    if (table.length === 0) {
      console.log("❌ Không tìm thấy bảng thời khóa biểu.");
      return;
    }
    const selectedWeek = $$$(
      "#ctl00_ContentPlaceHolder1_ctl00_ddlTuan option[selected]"
    ).val();

    const weekNumberMatch = selectedWeek.match(/Tuần\s+(\d+)/);

    const weekNumber = weekNumberMatch ? weekNumberMatch[1] : null;

    console.log("Tuần đang được chọn:", weekNumber);
    const dataList = [];

    table.find("td[onmouseover]").each((i, td) => {
      const attr = $$$(td).attr("onmouseover");
      const match = attr.match(/ddrivetip\((.*?)\)/);
      if (match && match[1]) {
        const rawParams = match[1];
        const params = rawParams
          .split(",")
          .map((p) => p.trim().replace(/^['"]|['"]$/g, ""));

        const tietBatDau = params[6] || "0";
        const soTiet = params[7] || "0";
        const thoiGian = getTimeRange(tietBatDau, soTiet);

        const date = getDateFromWeekAndDay(
          weekNumber,
          convertThuToNumber(params[3]),
          weekList
        ); // Tuần , Thứ
        const bd = thoiGian.split("-")[0].trim();
        const kt = thoiGian.split("-")[1].trim();
        const gioBatDau = `${date}T${bd}:00`;
        const gioKetThuc = `${date}T${kt}:00`;
        console.log(gioBatDau);
        const monHoc = {
          tenMon: params[1] || "",
          maMon: params[2] || "",
          thu: params[3] || "",
          tietBatDau,
          phong: params[5] || "",
          soTiet,
          giangVien: params[8] || "",
          ngayBatDau: params[9] || "",
          ngayKetThuc: params[10] || "",
          thoiGianHoc: thoiGian,
          gioBatDau,
          gioKetThuc,
        };
        dataList.push(monHoc);
      }
    });

    return dataList;
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
  }
}

module.exports = crawlThoiKhoaBieu;
