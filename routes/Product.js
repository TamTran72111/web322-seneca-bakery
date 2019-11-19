const router = require("express").Router();
const Product = require("../models/Product");

const validateProductInfo = formData => {
  const errors = {};

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

  return errors;
};

router.get("/list", (req, res) => {
  Product.find()
    .then(products => {
      res.render("Product/list", { products });
    })
    .catch(err => {
      console.log(`Something went wrong:\n${err}`);
      res.redirect("/product/dashboard");
    });
});

router.get("/dashboard", (req, res) => {
  res.render("Product/dashboard");
});

router.get("/add", (req, res) => {
  res.render("Product/add");
});

router.post("/add", (req, res) => {
  const formData = {
    title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity,
    description: req.body.description,
    taxable: req.body.taxable
  };
  const errors = validateProductInfo(formData);

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

router.get("/edit/:id", (req, res) => {
  Product.findById(req.params.id)
    .then(product => res.render("Product/edit", product))
    .catch(err => {
      res.redirect("/product/dashboard");
    });
});

router.put("/edit/:id", (req, res) => {
  const formData = {
    title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity,
    description: req.body.description,
    taxable: req.body.taxable
  };
  const errors = validateProductInfo(formData);

  if (Object.keys(errors).length > 0) {
    res.render("Product/edit", { ...errors, ...formData });
  } else {
    formData.taxable = formData.taxable == "yes";
    Product.findById(req.params.id)
      .then(product => {
        product.title = formData.title;
        product.price = formData.price;
        product.quantity = formData.quantity;
        product.description = formData.description;
        product.taxable = formData.taxable;
        product
          .save()
          .then(() => res.redirect("/product/list"))
          .catch(err => {
            console.log(`Something went wrong:\n${err}`);
            if (err.code === 11000) {
              console.log(product);
              res.render("Product/edit", {
                titleError: "Title is already used. It needs to be unique",
                _id: product._id,
                ...formData
              });
            } else {
              res.redirect("/product/dashboard");
            }
          });
      })
      .catch(err => {
        res.redirect("/product/dashboard");
      });
  }
});

module.exports = router;
