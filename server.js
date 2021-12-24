const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", require("./routes/User"));
app.use("/todos", require("./routes/Todo"));

mongoose.connect(
  process.env.MongoURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("connected to mongoDB");
  }
);

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
