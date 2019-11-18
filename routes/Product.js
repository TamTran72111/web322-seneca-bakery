const router = require("express").Router();
const Product = require("../models/Product");

router.get("/list", (req, res) => {
  res.render("Product/list");
});

router.get("/dashboard", (req, res) => {
  res.render("Product/dashboard");
});

router.get("/add", (req, res) => {
  res.render("Product/add");
});

router.post("/add", (req, res) => {
  const errors = {};
  const formData = {
    title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity,
    description: req.body.description,
    taxable: req.body.taxable
  };

  if (formData.title == "") {
    errors.titleError = "Title is required";
  }
  if (formData.price == "") {
    errors.priceError = "Price is required";
  } else if (isNaN(formData.price)) {
    errors.priceError = "Price needs to be a number";
  }
  if (formData.quantity == "") {
    errors.quantityError = "Quantity is required";
  } else if (isNaN(formData.quantity)) {
    errors.quantityError = "Quantity needs to be an integer";
  }
  if (formData.description == "") {
    errors.descriptionError = "Description is required";
  }
  if (formData.taxable == "") {
    errors.taxableError = "Taxable is required";
  }

  if (Object.keys(errors).length > 0) {
    res.render("Product/add", { ...errors, ...formData });
  } else {
    formData.taxable = formData.taxable == "yes";

    const product = new Product(formData);
    product
      .save()
      .then(() => {
        console.log(`Successfully add the product: ${formData.title}`);
        res.redirect("/product/dashboard");
      })
      .catch(err => {
        console.log(
          `Cannot add the product ${formData.title} because:\n${err}`
        );

        // Duplicate error code is 11000
        if (err.code === 11000) {
          res.render("Product/add", {
            titleError: "Title is already used. It needs to be unique",
            ...formData
          });
        }
      });
  }
});

module.exports = router;
