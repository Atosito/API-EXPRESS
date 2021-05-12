const Joi = require('joi');

module.exports = {
    // UPDATE /api/users/:userId
    updateUser: {
        body: {

        },
        params: {
            userId: Joi.string().hex().required()
        }
    },

    // POST /api/auth/login
    login: {
        body: {
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().required()
        }
    },
    createUser: {
        body: Joi.object({
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().min(7).required().strict(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict(),
        })
    }
};