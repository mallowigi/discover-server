/**
 * Created by eliorb on 22/04/2015.
 */
var usersCtrl = require('../controllers/users'),
    parse     = require('co-body');

function *getAllUsers () {
    this.body = yield *usersCtrl.getAllUsers();
}

function *createUser () {
    var newUser = yield parse(this);
    try {
        this.body = yield *usersCtrl.createUser(newUser);
        this.status = 201;
    } catch (e) {
        this.status = 412;
        this.response.body = e.toString();
    }

}

function *getUser (userId) {
    this.body = yield *usersCtrl.getUser(userId);
}

function *updateUser (userId) {
    var userData = yield parse(this);

    this.body = yield *usersCtrl.updateUser(userId, userData);
    if (this.body) {
        this.status = 202;
    }
}

function *login () {
    var userData = yield parse(this);

    var response = yield *usersCtrl.login(userData);
    if (response.data) {
        this.status = response.status;
        this.body = response.data;
    } else {
        this.status = response.status;
        this.body = response.message;
    }
}

module.exports = function (app, route) {
    app.use(route.get('/api/user', getAllUsers));

    app.use(route.post('/api/user', createUser));

    app.use(route.get('/api/user/:id', getUser));

    app.use(route.put('/api/user/:id', updateUser));

    app.use(route.post('/signup', createUser));

    app.use(route.post('/login', login));
}
