const express = require('express');
const { check } = require('express-validator');

const {
    getUsers, signup, login
} = require('../controllers/users-controllers');

const router = express.Router()

// GET api/users
router.get('/', getUsers)

// POST api/users/signup
router.post('/signup',
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail()
            .isEmail(),
        check('password')
            .isLength(5)
    ],
    signup)

// POST api/users/login
router.post('/login', login)

module.exports = router