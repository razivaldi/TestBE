const express = require('express');
const router = express.Router();
const Product = require("../models/product");
const midtransClient = require('midtrans-client');
const Cart = require("../models/cart");
const { roleMiddleware } = require('../middleware/isAuth');

const snap = new midtransClient.Snap({
  isProduction : false,
  serverKey : process.env.MIDTRANS_SERVER
});

router.post('/add-product', roleMiddleware('admin'),async (req, res) => {
  const { title, price, description, images, SKU, rating, publisher, category } = req.body;
  try {
    const product = new Product({ title, price, description, images, SKU, rating, publisher, category });
    await product.save();
    res.send({ message: "Product Created", product });
  } catch (error) {
    res.send({ message: error.message });
  }
})

router.post('/addToCart', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const userCart = await Cart.findOne({ userId });
    const product = await Product.findOne({ _id: productId });
    userCart.items?.push(product);
    await userCart.save();
    res.send({ message: "Product Added to Cart", userCart });
  } catch (error) {
    res.send({ message: error.message });
  }
})


// MELALUI MIDTRANS
router.post('/buy', async (req, res) => {
  const { title, price } = req.body;
  if (!title || !price) return res.send({ message: "title and price required" })
  console.log(title, price)
  const parameters = {
    "transaction_details": {
      "order_id": `${Math.floor(Math.random() * 100)} ${title} `,
      "gross_amount": price
    },
  };
  try {
    snap.createTransactionToken(parameters).then((token) => {
      res.send({token})
    })
  } catch (error) {
    res.send(error.data.error_message);
  }
})


module.exports = router