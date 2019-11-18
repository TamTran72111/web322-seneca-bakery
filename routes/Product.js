const router = require("express").Router();

router.get("/list", (req, res) => {
  res.render("Product/list");
});

router.get("/dashboard", (req, res) => {
  res.render("Product/dashboard");
});

router.get("/add", (req, res) => {
  res.render("Product/add");
});

module.exports = router;
