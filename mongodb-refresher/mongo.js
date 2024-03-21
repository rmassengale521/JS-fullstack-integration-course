const { MongoClient } = require('mongodb')

const url = `mongodb+srv://mongodbuser:u3a2XQaFu3rGIEco@cluster0.hvmdtyd.mongodb.net/products_test?retryWrites=true&w=majority&appName=Cluster0`

const createProduct = async (req, res, next) => {
    const { name, price } = req.body

    const newProduct = {
        name,
        price
    }

    const client = new MongoClient(url)

    try {
        await client.connect

        const db = client.db()
        const result = db.collection('products').insertOne(newProduct)

    } catch (error) {
        return res.json({ message: 'Could not store data' })
    }
    client.close()

    res.json(newProduct)
}

const getProducts = async (req, res, next) => {
    const client = new MongoClient(url)

    let products
    try {
        await client.connect

        const db = client.db()
        products = await db.collection('products').find().toArray()

    } catch (error) {
        return res.json({ message: 'Could not retrieve product data' })
    }
    client.close()

    res.json(products)
}

module.exports = {
    createProduct,
    getProducts
}