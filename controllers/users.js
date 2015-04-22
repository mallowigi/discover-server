/**
 * Created by eliorb on 22/04/2015.
 */
var parse = require('co-body'),
    db    = require('../config/db'),
    wrap  = require('co-monk'),
    Users = wrap(db.get('users'));

exports.getAllUsers = function *getAllUsers () {
    yield Users.find({});
}

exports.createUser = function *createUser (userData) {
    yield Users.insert(userData);
}

exports.getUser = function *getUser (userId) {
    yield Users.find({id: userId});
}

exports.updateUser = function *updateUser (userId, userData) {
    yield Users.updateById(userId, userData);
}

exports.login = function *login (userData) {
    var username = userData.username,
        password = userData.password;

    var user = yield Users.findOne({username: username, password: password});
    if (!user) {
        var usernameFound = yield Users.findOne({username: username});
        if (!usernameFound) {
            return {
                status: 404,
                message: 'User not found'
            };
        } else {
            console.log('dor');
            return {
                status: 401,
                message: 'Invalid password'
            };
        }
    }
    return {
        status: 200,
        data: user
    }
}
