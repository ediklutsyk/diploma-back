const mongoose = require('mongoose')

const addMonthAndYearFields = {
    $addFields: {
        'month': {$month: '$datetime'},
        'year': {$year: '$datetime'}
    }
};

const matchMonthYearAndUser = (month, year, user) => {
    return {
        $match: {
            $and: [
                {month: month},
                {year: year},
                {user_id: user},
            ]
        }
    }
}


const OperationSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    bill_id: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['spend', 'earn'],
        required: true,
        default: 'spend'
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
})

OperationSchema.statics.findByUser = async (id) => {
    // Search for a operations by user id.
    const operations = await Operation.find({user_id: id})
    if (!operations) {
        throw new Error('Invalid user id')
    }
    return operations
}

const findByMonthAndYear = async (month, year, user) => {
    // Search for a operations by user id.
    const operations = await Operation.aggregate([
            addMonthAndYearFields,
            matchMonthYearAndUser(month, year, user),
            {$unset: ['month', 'year']}
        ]
    )
    if (!operations) {
        throw new Error('Cant found any operations')
    }
    return operations
}

OperationSchema.statics.findByCurrentMonth = async (user) => {
    const now = new Date()
    return await findByMonthAndYear(now.getMonth() + 1, now.getFullYear(), user);
}

OperationSchema.statics.getTotalByCategoriesAndMonth = async (user, month, year) => {
    return Operation.aggregate([
        addMonthAndYearFields,
        matchMonthYearAndUser(month, year, user),
        {
            $group: {
                _id: '$category_id',
                total: {$sum: "$amount"},
            }
        },
        {$sort: {_id: 1}}
    ])
}

OperationSchema.statics.getTotalByCategory = async (user, category) => {
    const now = new Date()
    return Operation.aggregate([
        addMonthAndYearFields,
        {
            $match: {
                $and: [
                    {month: now.getMonth() + 1},
                    {year: now.getFullYear()},
                    {user_id: user},
                    {category_id: category},
                ]
            }
        },
        {
            $group: {
                _id: null,
                total: {$sum: "$amount"},
            }
        },
        {$unset: ['_id']}
    ])
}

OperationSchema.statics.getTotalForMonth = async (user, month, year) => {
    return Operation.aggregate([
        addMonthAndYearFields,
        matchMonthYearAndUser(month, year, user),
        {
            $group: {
                _id: null,
                total: {$sum: "$amount"},
            }
        },
        {$unset: ['_id']}
    ])
}

const Operation = mongoose.model('Operation', OperationSchema)
module.exports = Operation