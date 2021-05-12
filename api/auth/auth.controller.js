const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const config = require('../../config/config');
const userModel = require('../user/user.model.js');


/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {

    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({ email });

    if (!user) {
        //If the user isn't found in the database, return a message
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        return next(err)
    }

    const validate = await user.isValidPassword(password);

    if (!validate) {
        //Wrong credentials
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        return next(err)
    }

    // Logged in succesfully
    const token = jwt.sign({
        email: user.email
    }, config.jwtSecret);
    return res.json({
        token,
        email: user.email
    });

}

async function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await userModel.create({ email, password, role:'user' });
        return res.json({
            user
        })
    } catch (error) {
        //const err = new APIError('Email already registered', httpStatus.INTERNAL_SERVER_ERROR, true);
        return next(error)
    }

}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
        user: req.user,
        num: Math.random() * 100
    });
}

module.exports = { login, signup };