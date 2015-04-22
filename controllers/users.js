/**
 * Created by eliorb on 22/04/2015.
 */
var parse = require('co-body'),
    db = require('../config/db'),
    wrap = require('co-monk'),
    Users = wrap(db.get('users'));

exports.all = function *getAllUsers (){
    yield Users.find({});
}

