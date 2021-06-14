const dotenv = require('dotenv');
dotenv.config();

module.exports.mongoURL = `mongodb+srv://@cluster0.8gfqn.mongodb.net/diploma_db?retryWrites=true&w=majority`
module.exports.mongoData = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    dbName: "diploma_db",
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
};

module.exports.jwtSecret = process.env.JWT_KEY

module.exports.awsKey = process.env.AWS_KEY_ID
module.exports.awsSecret = process.env.AWS_SECRET_ACCESS_KEY
module.exports.s3BucketName = process.env.S3_BUCKET_NAME
