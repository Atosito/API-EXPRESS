const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// add all yours db models to require them at once line

db.user = require('./api/user/user.model')

module.exports = db;