const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema


const userShema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 5 },
    image: { type: String, required: true },
    places: [{ type: Schema.Types.ObjectId, required: true, ref: 'Place' }],
})

userShema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userShema)