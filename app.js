#! node --harmony
'use strict';

// Requires
var koa         = require('koa')
    , path      = require('path')
    , fs        = require('fs')
    , views     = require('co-views')
    , serve     = require('koa-static')
    , route     = require('koa-route')
    , sessions  = require('koa-session')
    , cors      = require('koa-cors')
    , logger    = require('koa-logger')
    , ratelimit = require('koa-better-ratelimit')
    , jsonp     = require('koa-jsonp');

// Initilize
var app = module.exports = koa(),
    render = views(__dirname + '/views', {map: {html: 'ejs'}}),
    port   = process.env.PORT || 9353,
    env    = process.env.NODE_ENV || 'development'

app.keys = ['place-your-key-here'];

app.use(sessions(app));

if ('test' == env) {
    port = 9354;
}

app.use(cors());
app.use(logger());
app.use(jsonp());
app.use(ratelimit({duration: 1000 * 60 * 3, max: 10, blacklist: []}));

// Routing

// static file serv
app.use(serve(__dirname + '/public'));

/* helper: to display routes on '/index.html' */
route.routes = [];

route.record = function (routeInfo) {
    route.routes.push(routeInfo);
};

route.record({method: 'GET', path: '/'});
/* helper */

app.use(route.get('/', function *() {
    this.body = yield render('index.html', {
        siteName: 'discoverServer',
        /* helper: list of routes and methods */
        routes: route.routes
    });
}));

// Bootstrap routes/api
var routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(function (file) {
    if (file[0] === '.' || path.extname(file) !== '.js') {
        return;
    }
    require(routesPath + '/' + file)(app, route);
});

// handle error
app.use(function *(next) {
    try {
        yield next;
    }
    catch (err) {
        this.status = 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
});

app.use(function *() {
    var err = new Error();
    err.status = 404;
    this.body = yield render('404.html', {errors: err});
});

if (!module.parent) {
    app.listen(port);
}
console.log('Listening on port:' + port + ' in ' + env + ' mode.');
