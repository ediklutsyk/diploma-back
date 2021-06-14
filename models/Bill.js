const mongoose = require('mongoose')
const configs = require('../configs')

const BillSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
        default: '#000000'
    },
    icon: {
        type: String,
        required: true,
        default: 'mode_edit'
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        enum: ['card', 'cash', 'storing'],
        default: 'card'
    },
    goals: [{
        name: {
            type: String,
            required: true,
            trim: true,
            default: 'Загальний'
        },
        current_balance: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        required_balance: {
            type: Number,
            required: true,
            min: 0
        }
    }]
})


BillSchema.statics.findByUser = async (id) => {
    // Search for a bills by user id.
    const bills = await Bill.find({user_id: id})
    if (!bills) {
        throw new Error('Invalid user id')
    }
    return bills
}

BillSchema.methods.addGoal = async function (name, required_balance) {
    const bill = this
    const goal = {
        name: name,
        required_balance: required_balance
    }
    bill.goals = bill.goals.concat(goal)
    await bill.save()
    return goal
}

const Bill = mongoose.model('Bill', BillSchema)
module.exports = Bill