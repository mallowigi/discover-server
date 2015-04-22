/**
 * Created by eliorb on 22/04/2015.
 */
var usersCtrl = require('../controllers/users');

module.exports = function (app, route) {
    app.use(route.get('/api/user', function *() {
        this.body = yield *usersCtrl.all();
    }));
}
