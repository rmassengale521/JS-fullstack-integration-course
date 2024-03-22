const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');
const User = require('../models/users')


const getUsers = async (req, res, next) => {
    let users
    try {
        users = await User.find({}, '-password')

    } catch (error) {
        return next(new HttpError('Something went wrong, could not fetch users', 500))
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) })
}

const signup = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs, please check your data', 422)
    }

    const { name, email, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (error) {
        return next(new HttpError('Something went wrong, could not create user', 500))
    }

    if (existingUser) {
        return next(new HttpError('User already exists with that email', 422))
    }

    const newUser = new User({
        name,
        email,
        password,
        image: req.file.path,
        places: []
    })

    try {
        await newUser.save()
    } catch (err) {
        const error = new HttpError('Failed to create user', 500)
        return next(error)
    }

    res.status(201).json({ user: newUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
    const { email, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (error) {
        return next(new HttpError('Something went wrong, could not login user', 500))
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('invalid credentials, could not log in', 401))
    }

    res.json({ message: 'logged in', user: existingUser.toObject({ getters: true }) })
}

module.exports = {
    getUsers,
    signup,
    login
}