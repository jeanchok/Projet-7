const rateLimit = require('express-rate-limit');

// Middleware to limit the number of login requests
const loginlimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per `window` (here, per 10 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.',
})

module.exports = loginlimiter;