const _ = require('lodash')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { User } = require('../modules/user')
const config = require('config')
const asyncMiddleware = require('../middleware/async')


router.post('/', async (req, res)=> {
    let {error} = validateAuth(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email})
    if (!user) return res.send(400).send('Invalid email or password')

    

    const validPassword = await bcrypt.compare (req.body.password, user.password)
    if (!validPassword) return res.send(400).send('Invalid email or password')
    
    const token = user.generateAuthToken()

    res.send(token)
})


function validateAuth(user) {
    const schema = {
      email: Joi.string().min(3).max(255).required().email(),
      password: Joi.string().min(3).max(255).required()
    };
  
    return Joi.validate(user, schema);
  }

module.exports = router