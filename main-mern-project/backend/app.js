const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})

app.use('/api/places', placesRoutes)

app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
    return next(new HttpError('Could not find this route', 404))
})

app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }

    res.status(err.code || 500)
    res.json({
        message: err.message || 'An unknown Error occurred'
    })
})

mongoose.connect('mongodb+srv://mernproject2:yg5mnkMj1mDoj2qD@cluster0.hvmdtyd.mongodb.net/mernPlaces?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        app.listen(5000)
    })
    .catch((err) => {
        console.error(err);
    })
