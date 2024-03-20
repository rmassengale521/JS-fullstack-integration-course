const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Richard Massengale',
        email: 'asdf@asdf.asdf',
        password: 'password'
    }
]

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS })
}

const signup = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs, please check your data', 422)
    }

    const { name, email, password } = req.body

    const existingUser = DUMMY_USERS.find(user => user.email === email)

    if (existingUser) {
        return next(new HttpError('An account already exists with that email.', 422))
    }

    const newUser = {
        id: uuid(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(newUser)

    res.status(201).json({ user: newUser })
}

const login = (req, res, next) => {
    const { email, password } = req.body

    const selectedUser = DUMMY_USERS.find(user => user.email === email)

    if (!selectedUser || selectedUser.password !== password) {
        return next(new HttpError('Could not Login, please double check email and password', 401))
    }

    res.json({ message: 'logged in' })
}

module.exports = {
    getUsers,
    signup,
    login
}