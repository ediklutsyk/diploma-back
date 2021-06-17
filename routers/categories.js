const express = require('express')
const Category = require('../models/Category')
const Operation = require('../models/Operation')
const Bill = require('../models/Bill')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    // Create a new category
    try {
        const category = new Category({
            ...req.body,
            user_id: req.user.id
        })
        await category.save()
        res.status(200).send(category)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/user', auth, async (req, res) => {
    // View all bills of the user
    try {
        console.log(req.query)
        const user = req.user.id
        const month = parseInt(req.query.month)
        const year = parseInt(req.query.year)
        let total = await Operation.getTotalForMonth(user, month, year);
        total = total.map(obj => obj.total)[0]; // todo
        const totalByCategories = await Operation.getTotalByCategoriesAndMonth(user, month, year);
        let categories = await Category.findByUser(req.user.id)
        if (!categories) {
            return res.status(404).send({error: 'Cant found categories for this user'})
        }
        categories = categories.map(category => {
            let totalByCategory = totalByCategories.find(obj => {
                return obj._id === category._id.toString()
            })
            if (total && totalByCategory) {
                console.log((totalByCategory.total / total),(totalByCategory.total / total).toFixed(2) * 100 )
                return {
                    ...category._doc,
                    totalByCategory: totalByCategory.total,
                    percent: (totalByCategory.total / total).toFixed(2) * 100 | 0
                }
            } else {
                return {
                    ...category._doc,
                    totalByCategory: 0,
                    percent: 0
                }
            }
        })
        res.send(categories)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/stats', auth, async (req, res) => {
    // View all bills of the user
    try {
        const totalByCategories = await Operation.getTotalByCategories(req.user.id)
        if (!totalByCategories) {
            return res.status(404).send({error: 'Cant found operations for this user this month'})
        }
        let categories = await Category.findByUser(req.user.id)
        if (!categories) {
            return res.status(404).send({error: 'Cant found categories for this user'})
        }
        const total = totalByCategories.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0)
        categories = categories.map(category => {
            let totalByCategory = totalByCategories.find(obj => {
                return obj._id === category._id.toString()
            })
            if (total && totalByCategory) {
                console.log((totalByCategory.total / total),(totalByCategory.total / total).toFixed(2) * 100 )
                return {
                    ...category._doc,
                    totalByCategory: totalByCategory.total,
                    percent: (totalByCategory.total / total).toFixed(2) * 100 | 0
                }
            } else {
                return {
                    ...category._doc,
                    totalByCategory: 0,
                    percent: 0
                }
            }
        })
        const sorted = categories.sort((a, b) => b.totalByCategory - a.totalByCategory)
        res.send({categories: sorted, total: total})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})


module.exports = router