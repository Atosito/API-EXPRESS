const User = require('./user.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
    User.get(id)
        .then((user) => {
            req.user = user; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
    return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function create(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.create({ email, password });
        return res.json({
            user
        })
    } catch (error) {
        return next(error)
    }
}

/**
 * Update existing user
 * @property {string} req.body.email - The username of user.
 * @property {string} req.body.password - The mobileNumber of user.
 * @property {boolean} req.body.confirmed - Bool if email is verified or not.
 * @property {string} req.body.role - The role of user.
 * 
 * @returns {User}
 */
function update(req, res, next) {
    const user = req.user;
    user.password = req.body.password;
    user.email = req.body.email;
    user.confirmed = req.body.confirmed;
    user.role = req.body.role;

    user.save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip })
        .then(users => res.json(users))
        .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
    const user = req.user;
    user.remove()
        .then(deletedUser => res.json(deletedUser))
        .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };