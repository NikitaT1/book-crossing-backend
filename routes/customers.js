const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
const {Customer, validationCustomer} = require('../modules/customer')

router.get('/', async (req,res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)
})

router.post('/', async (req, res) => {
    let {error} = validationCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    
    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone

    })
    try {
        let result = await customer.save()
        res.send(result)
    }
    catch(ex) {
        res.send(ex.message)
    }
})

router.put('/:id', async (req, res) => {
   
    let {error} = validationCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    
    let customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    })

    if(!customer) return res.status(400).send('No such customer')
    
    res.send(customer)

})

router.delete('/:id', async (req,res) => {
    let customer = await Customer.findOneAndRemove(req.params.id)

    if(!customer) return res.status(400).send('No such customer')
    res.send(customer)
})

router.get('/:id', async (req,res) => {
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(400).send('No such customer')
    res.send(customer)
})

module.exports = router