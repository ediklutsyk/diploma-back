const express = require('express')
const Bill = require('../models/Bill')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    // Create a new bill
    try {
        const bill = new Bill({
            ...req.body,
            user_id: req.user.id
        })
        if (bill.type === 'storing') {
            await bill.addGoal('Загальний', 0);
        } else {
            await bill.save()
        }
        res.status(200).send(bill)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/user', auth, async (req, res) => {
    // View all bills of the user
    try {
        const bills = await Bill.findByUser(req.user.id)
        if (!bills) {
            return res.status(404).send({error: 'Cant found bills for this user'})
        }
        res.send(bills)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.post('/action', auth, async (req, res) => {
    console.log(req.body)
    const bill = await Bill.findById(req.body.fromId)
    if (!bill) {
        return res.status(404).send({error: 'Cant found bill for this user'})
    }
    const amount = req.body.amount
    const action = req.body.action
    switch (action) {
        case 'move':
            const billTo = await Bill.findById(req.body.toId)
            bill.balance = bill.balance - amount;
            billTo.balance = billTo.balance + amount;
            billTo.save()
            break;
        case 'add':
            bill.balance = bill.balance + amount;
            break;
        case 'refresh':
            bill.balance = amount;
            break;
    }
    bill.save()
    res.status(200).send(bill)
})

// todo transfer money from one bill to another
// todo add money to the bill

module.exports = router