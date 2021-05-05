const Joi = require('joi')
const mongoose = require('mongoose')


const customersSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false},
    name: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        minlength: 3,
        maxlength: 50
    }
})


const Customer = mongoose.model('Customer', customersSchema)

let validationCustomer = (value) => {
    let schema = { 
        isGold: Joi.boolean().required(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(value, schema)
}

exports.Customer = Customer
exports.validationCustomer = validationCustomer