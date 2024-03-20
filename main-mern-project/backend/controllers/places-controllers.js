const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location')

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    }
]

const getPlaceById = (req, res, next) => {
    const { placeId } = req.params
    const place = DUMMY_PLACES.find(p => p.id === placeId)

    if (!place) {
        return next(new HttpError(`Could not find a place for ID: '${placeId}'`, 404))
    }

    res.json({
        place
    })
}

const getPlacesByUser = (req, res, next) => {
    const { userId } = req.params
    const userPlaces = DUMMY_PLACES.filter(place => place.creator === userId)

    if (!userPlaces.length) {
        return next(new HttpError(`Could not find any places for User ID: '${userId}'`, 404))
    }

    res.json(userPlaces)
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

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location,
        address,
        creator
    }

    DUMMY_PLACES.push(createdPlace)

    res.status(201).json({ place: createdPlace })
}

const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs, please check your data', 422)
    }

    const { title, description } = req.body
    const { placeId } = req.params

    const updatedPlace = { ...DUMMY_PLACES.find(place => place.id === placeId) }
    const updatedIndex = DUMMY_PLACES.findIndex(place => place.id === placeId)

    updatedPlace.title = title
    updatedPlace.description = description
    DUMMY_PLACES[updatedIndex] = updatedPlace

    res.status(200).json({ place: updatedPlace })
}

const deletePlaceById = (req, res, next) => {
    const { placeId } = req.params

    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError(`Could not find a place for ID: '${placeId}'`, 404)
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)

    res.status(200).json({ message: 'place deleted' })
}

module.exports = {
    getPlaceById,
    getPlacesByUser,
    createPlace,
    updatePlaceById,
    deletePlaceById
}