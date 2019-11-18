const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const productRouter = require("./routes/Product");

app.use("/product/", productRouter);
app.get("/", (req, res) => res.redirect("/product/dashboard"));

const PORT = process.env.PORT || 3000;
const DBURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@seneca-bakery-4yzvx.mongodb.net/bakery?retryWrites=true&w=majority`;

mongoose
  .connect(DBURL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database is connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(`Something went wrong: ${err}`);
  });
