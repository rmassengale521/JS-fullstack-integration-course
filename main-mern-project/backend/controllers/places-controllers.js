const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')
const User = require('../models/users');
const mongoose = require('mongoose');


const getPlaceById = async (req, res, next) => {
    const { placeId } = req.params

    let place
    try {
        place = await Place.findById(placeId)
    } catch (error) {
        return next(new HttpError('Something went wrong. Could not find place.', 500))
    }

    if (!place) {
        return next(new HttpError(`Could not find a place for ID: '${placeId}'`, 404))
    }

    res.json({
        place: place.toObject({ getters: true })
    })
}

const getPlacesByUser = async (req, res, next) => {
    const { userId } = req.params

    let userPlaces
    try {
        userPlaces = await Place.find({ creator: userId })
    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again later.', 500))
    }

    if (!userPlaces.length) {
        return next(new HttpError(`Could not find any places for User ID: '${userId}'`, 404))
    }

    res.json({ userPlaces: userPlaces.map(place => place.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs, please check your data', 422))
    }

    const { title, description, address, creator } = req.body

    let location
    try {
        location = await getCoordsForAddress(address)
    } catch (error) {
        return next(error)
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        creator
    })

    let user
    try {
        user = await User.findById(creator)
    } catch (error) {
        return next(new HttpError('Failed to create place', 500))
    }

    if (!user) {
        return next(new HttpError('Could not find user', 404))
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()

        await createdPlace.save({ session: sess })

        user.places.push(createdPlace)

        await user.save({ session: sess })

        await sess.commitTransaction()
    } catch (err) {
        const error = new HttpError('Failed to create place', 500)
        return next(error)
    }

    res.status(201).json({ place: createdPlace })
}

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs, please check your data', 422))
    }

    const { title, description } = req.body
    const { placeId } = req.params

    let updatedPlace
    try {
        updatedPlace = await Place.findById(placeId)
    } catch (error) {
        return next(new HttpError('Something went wrong, could not update place.', 500))
    }

    updatedPlace.title = title
    updatedPlace.description = description

    try {
        await updatedPlace.save()
    } catch (error) {
        return next(new HttpError('Something went wrong, could not update place.', 500))
    }

    res.status(200).json({ place: updatedPlace.toObject({ getters: true }) })
}

const deletePlaceById = async (req, res, next) => {
    const { placeId } = req.params

    let place
    try {
        place = await Place.findById(placeId).populate('creator')
    } catch (error) {
        return next(new HttpError('Something went wrong, could not delete place', 500))
    }

    if (!place) {
        return next(new HttpError('Could not find place to delete', 404))
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()

        await place.deleteOne({ session: sess })

        place.creator.places.pull(place)

        await place.creator.save({ session: sess })

        await sess.commitTransaction()
    } catch (error) {
        return next(new HttpError('Something went wrong, could not delete place', 500))
    }

    res.status(200).json({ message: 'place deleted' })
}

module.exports = {
    getPlaceById,
    getPlacesByUser,
    createPlace,
    updatePlaceById,
    deletePlaceById
}