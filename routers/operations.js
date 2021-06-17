const express = require('express')
const Operation = require('../models/Operation')
const Category = require('../models/Category')
const Bill = require('../models/Bill')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    // Create a new bill
    try {
        const body = req.body;
        const operation = new Operation({
            ...body,
            user_id: req.user.id
        })
        const bill = await Bill.findById(body.bill_id);
        console.log('bill', bill, body.bill_id)
        if (bill) {
            await operation.save()
            const balance = bill.balance;
            bill.balance = body.type === 'earn' ? balance + body.amount : balance - body.amount;
            console.log(balance, bill)
            await bill.save()
            res.status(200).send(operation)
        } else {
            res.status(400).send({error: 'Cant found bill for this operation'})
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/user', auth, async (req, res) => {
    // View all bills of the user
    try {
        const month = parseInt(req.query.month)
        const year = parseInt(req.query.year)
        let operations = await Operation.findByMonthAndYear(req.user.id, month, year)
        if (!operations) {
            return res.status(404).send({error: 'Cant found operations for this user this month'})
        }
        let categories = await Category.findByUser(req.user.id)
        if (!categories) {
            return res.status(404).send({error: 'Cant found categories for this user'})
        }
        let bills = await Bill.findByUser(req.user.id)
        if (!bills) {
            return res.status(404).send({error: 'Cant found bills for this user'})
        }
        operations = operations.map(operation => {
            let category = categories.find(category => {
                return category._id.toString() === operation.category_id.toString()
            })
            let bill = bills.find(bill => {
                return bill._id.toString() === operation.bill_id.toString()
            })
            return {
                ...operation,
                categoryName: category.name,
                categoryColor: category.color,
                categoryIcon: category.icon,
                billName: bill.name
            }
        });
        res.send(operations)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/categories/total', auth, async (req, res) => {
    // View all bills of the user
    try {
        const operations = await Operation.getTotalByCategories(req.user.id)
        if (!operations) {
            return res.status(404).send({error: 'Cant found operations for this user this month'})
        }
        res.send(operations)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/total', auth, async (req, res) => {
    // View all bills of the user
    try {
        const month = parseInt(req.query.month)
        const year = parseInt(req.query.year)
        const operations = await Operation.getTotalForMonth(req.user.id, month, year)
        if (!operations) {
            return res.status(404).send({error: 'Cant found operations for this user this month'})
        }
        res.send(operations)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

module.exports = router