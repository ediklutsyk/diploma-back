const express = require('express')
const mongoose = require('mongoose')
const configs = require('./configs')
const cors = require('cors')
const port = 3000
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const userRouter = require('./routers/user')
const billRouter = require('./routers/bills')
const operationsRouter = require('./routers/operations')
const categoriesRouter = require('./routers/categories')
const templatesRouter = require('./routers/templates')

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/bills', billRouter);
app.use('/operations', operationsRouter);
app.use('/categories', categoriesRouter);
app.use('/templates', templatesRouter);

//DB
mongoose.connect(configs.mongoURL, configs.mongoData)
    .then(() => console.log('connected to the db'))
    .catch((err) => console.log(err))

app.listen(port, () => {
    console.log(`Example apps listening at http://localhost:${port}`)
})

