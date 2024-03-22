const express = require('express');
const { check } = require('express-validator');

const {
    getPlaceById,
    getPlacesByUser,
    createPlace,
    updatePlaceById,
    deletePlaceById
} = require('../controllers/places-controllers')

const fileUpload = require('../middleware/file-uplaod')

const router = express.Router()


// GET /api/places/:placeId
router.get('/:placeId', getPlaceById)

// GET /api/places/user/:userId
router.get('/user/:userId', getPlacesByUser)

// POST /api/places
router.post('/',
    fileUpload.single('image'),
    [
        check('title')
            .not()
            .isEmpty(),
        check('address')
            .not()
            .isEmpty(),
        check('description')
            .isLength({ min: 5 })
    ],
    createPlace)

// PATCH /api/places/:placeId
router.patch('/:placeId',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description')
            .isLength({ min: 5 })
    ],
    updatePlaceById)

// DELETE /api/places/:placeId
router.delete('/:placeId', deletePlaceById)

module.exports = router