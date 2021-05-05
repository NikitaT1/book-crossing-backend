const Joi = require('joi')
const mongoose = require('mongoose')

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
})

const Genre = mongoose.model('Genre', genresSchema)

let validationGenre = (value) => {
    let schema = { 
        name: Joi.string().min(3).required()
    }
    return Joi.validate(value, schema)
}

exports.Genre = Genre
exports.genresSchema = genresSchema
exports.validationGenre = validationGenre