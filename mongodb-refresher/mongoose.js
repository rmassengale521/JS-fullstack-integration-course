const mongoose = require('mongoose');

const Product = require('./models/product')

mongoose.connect('mongodb+srv://mongodbuser:u3a2XQaFu3rGIEco@cluster0.hvmdtyd.mongodb.net/products_test?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('connected to db');
    })
    .catch(() => {
        console.log('connection failed');
    })


const createProduct = async (req, res, next) => {
    const { name, price } = req.body

    const createdProduct = new Product({
        name,
        price
    })

    const result = await createdProduct.save()
    console.log(typeof createdProduct.id);
    res.json(result)
}

const getProducts = async (req, res, next) => {
    const products = await Product.find().exec()

    res.json(products)
}

module.exports = {
    createProduct,
    getProducts
}