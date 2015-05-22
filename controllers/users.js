/**
 * Created by eliorb on 22/04/2015.
 */
var parse = require('co-body'),
    db    = require('../config/db'),
    wrap  = require('co-monk'),
    User  = require('../models/User'),
    Users = wrap(db.get('users'));

exports.getAllUsers = function *getAllUsers () {
    return yield Users.find({});
}

exports.createUser = function *createUser (userData) {
    var newUser = new User(userData);

    if (newUser.validate()) {
        return yield Users.insert(newUser);
    } else {
        throw Error("Invalid user data");
    }
}

exports.getUser = function *getUser (userId) {
    return yield Users.find({id: userId});
}

exports.updateUser = function *updateUser (userId, userData) {
    return yield Users.updateById(userId, userData);
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
