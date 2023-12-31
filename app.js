require("dotenv").config()
require('express-async-errors')

const express = require("express");
const app = express();


const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send('<h1>Store Api</h1> <a href="/api/v1/products"> Producs Route </a>');
});

app.use('/api/v1/products', productsRouter )

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = 3000;

const start = async () => {
  try {
    //connectDB
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log("working on port: 3000 ...."));
  } catch (error) {
    console.log(error);
  }
};

start();
