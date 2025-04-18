const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`🚀 Server chạy tại http://localhost:${port}`);
});
