var express = require('express'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	compress = require('compression'),
	errorhandler = require('errorhandler'),
	mongoose = require('mongoose'),
	ECT = require('ect'),
	expressJwt = require('express-jwt'),
	sanitizer = require('sanitize-html'),
	_ = require('underscore'),
	secret = require('./config/secret');

var app = module.exports = express();

if (app.get('env') === 'prod') {
	app.use(compress());
	app.set('views', __dirname + '/dist/app');
	var ectRenderer = ECT({ watch: true, root: __dirname + '/dist/app', ext : '.html' });
	app.use(express.static(__dirname + '/dist', { maxAge: 345600000 })); // four days
	app.use(errorhandler());
} else {
	app.set('views', __dirname + '/client/app');
	var ectRenderer = ECT({ watch: true, root: __dirname + '/client/app', ext : '.html' });
	app.use(express.static(__dirname + '/client'));
	app.use(errorhandler({dumpExceptions: true, showStack: true}));
}

mongoose.connect(secret.mongoPath, function onMongooseError(err) {
	if (err) { throw err; } // Log This
});

// All routes need to be protected by JWT
app.use('/api/s/', expressJwt({secret: secret.jwtSecret}));

app.set('port', process.env.PORT || 8080);
app.engine('.html', ectRenderer.render);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

app.use(function (err, req, res, next) {
	if (err.constructor.name === 'UnauthorizedError') {
		return res.status(401).json({'success': false, 'err': 'Unauthorized'});
	}
	next();
});

app.use(function (req, res, next) {
	if (req.body) {
		_.each(req.body, function(value, key) {
			if(!parseInt(value,10) && value !== null) {
				if (typeof value === 'string') {
					value = value.replace(/&gt;/gi, '>');
					value = value.replace(/&lt;/gi, '<');
					value = value.replace(/(&copy;|&quot;|&amp;)/gi, '');
				}
				req.body[key] = sanitizer(value, {
					allowedTags: []
				});
			}
		});
	}
	// define user
	req.user = {};
	next();
});

require('./server/routes.js')(app);

app.listen(app.get('port'), function() {
	console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});