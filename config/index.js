require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    saltRounds: 12,
    atSecretKey: "access token refresh key",
    rtSecretKey: "refresh token refresh key",
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT
    },
    awsAccessKey: process.env.AWS_ACCESS_KEY,
    awsSecretKey: process.env.AWS_SECRET_KEY,
    bucketName: process.env.BUCKET_NAME,
    region:process.env.REGION, 
    stripePublishableKey: process.env.STRIPE_PUBLISH_KEY,
    stripeSecretKey: process.env.STRIPE_SECREAT_KEY,
}