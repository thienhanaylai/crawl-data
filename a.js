const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
const vietnamTime = dayjs().tz("Asia/Ho_Chi_Minh").format();
console.log(vietnamTime);
