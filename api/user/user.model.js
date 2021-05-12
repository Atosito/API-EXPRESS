const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const bcrypt = require("bcryptjs");

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
    email: { type: String, trim: true, lowercase: true, unique: true, },
    password: { type: String },
    confirmed: { type: Boolean, default: false },
    role: { type: String, required: true }
}, { timestamps: true });

/**
 * Add your
 * - validations
 * - virtuals
 */

/**
 * Pre
 */


UserSchema.pre('create', async (next) => {
    //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
    //your application becomes.
    const hash = await bcrypt.hashSync(this.password, 10);
    //Replace the plain text password with the hash and then store it
    this.password = hash;
    //Indicates we're done and moves on to the next middleware
    next();
}

)


/**
 * Methods
 */
UserSchema.method({
    isValidPassword: async (password) => {
        const user = this;
        //Hashes the password sent by the user for login and checks if the hashed password stored in the
        //database matches the one sent. Returns true if it does else false.
        const compare = await bcrypt.compare(password, user.password);
        return compare;
    }

});

/**
 * Statics
 */
UserSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);