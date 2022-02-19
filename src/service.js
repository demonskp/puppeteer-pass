const express = require("express");
const cookieParser = require("cookie-parser");
const { loadLocalRouter } = require("./routes");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

loadLocalRouter(app);

app.listen(9000, () => {
  console.log("启动成功：localhost:9000");
});