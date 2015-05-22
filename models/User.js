var _ = require('lodash');

const USER_REGEX = /[a-z][a-zA-Z0-9_-]*/;

function User (userData) {
    _.extend(this, userData);
};

User.prototype.validate = function validate () {
    return this.username && USER_REGEX.test(this.username);
};

module.exports = User;
