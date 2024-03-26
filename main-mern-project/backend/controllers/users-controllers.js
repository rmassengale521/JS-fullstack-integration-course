const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const jwt = require("jsonwebtoken")

const HttpError = require('../models/http-error');
const User = require('../models/users')
const { JWT_SECRET } = process.env


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

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (error) {
        return next(new HttpError('Something went wrong, could not create user', 500))
    }

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: []
    })

    try {
        await newUser.save()
    } catch (err) {
        return next(new HttpError('Failed to create user', 500))
    }

    let token
    try {
        token = jwt.sign(
            {
                userId: newUser.id, email: newUser.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        )
    } catch (error) {
        return next(new HttpError('Failed to create user', 500))
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email, token })
}

const login = async (req, res, next) => {
    const { email, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (error) {
        return next(new HttpError('Something went wrong, could not login user', 500))
    }

    if (!existingUser) {
        return next(new HttpError('invalid credentials, could not log in', 403))
    }

    let isValidPassword = false
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (error) {
        return next(new HttpError('Something went wrong, could not login user', 500))
    }

    if (!isValidPassword) {
        return next(new HttpError('invalid credentials, could not log in', 403))
    }

    let token
    try {
        token = jwt.sign(
            {
                userId: existingUser.id, email: existingUser.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        )
    } catch (error) {
        return next(new HttpError('Something went wrong, could not login user', 500))
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token })
}

module.exports = {
    getUsers,
    signup,
    login
}