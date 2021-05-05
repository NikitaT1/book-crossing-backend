const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:3,
        maxlength:50,
    },
    email: {
        type: String,
        unique: true,
        minlength:3,
        maxlength:255,
        required: true
    },
    password: {
        type: String,
        minlength:3,
        maxlength:1024,
        required: true
    },
    isAdmin: Boolean
})

usersSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
    return token
}

const User = mongoose.model('User', usersSchema)

function validateUser(user) {
    const schema = {
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(3).max(255).required().email(),
      password: Joi.string().min(3).max(255).required()
    };
  
    return Joi.validate(user, schema);
  }

  exports.User = User
  exports.validateUser = validateUser