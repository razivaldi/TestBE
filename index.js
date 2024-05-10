const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const { authMiddleware } = require('./middleware/isAuth');
const app = express();
const port = 8000;
require('dotenv').config()

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoute);
app.use(authMiddleware,productRoute);


app.get('/', (req, res) => {
  res.send("Hello World!")
})
mongoose.set("strictQuery", true);
mongoose
  .connect(
    process.env.MONGO_DB,
  )
  .then((res) => {
    console.log('Connected to MongoDB')
    app.listen(port)
  })
  .catch((err) => console.log(err));
module.exports = app