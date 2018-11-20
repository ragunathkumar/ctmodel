var express = require('express');
var path = require('path');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
// var passport = require('passport');
// var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var handlebarsHelpers = require('./helpers/handlebars');
var admin=require('./routes/admin');
var routes = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');
var tests = require('./routes/tests');
var answers = require('./routes/answers');

var app =express();
//view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expHandlebars({'defaultLayout' : 'layout', helpers : handlebarsHelpers}));
app.set('view engine', 'handlebars');


//app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
	secret : 'secret',
	saveUninitialized : 'true',
	resave : 'true'
}));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(expressValidator({
	errorFormatter : function(param, msg, value){
		var namespace = param.split('.'),
		 root = namespace.shift(),
		 formParam = root;

		while(namespace.length){
			formParam = '[' + namespace.shift() + ']';
		}
		return{
			param : formParam,
			msg : msg,
			value : value
		};

	}
}));

app.use(flash());
//global variable 
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.session.username || null;
	res.locals.admin = req.session.adminname || null;
	res.locals.testAnsPeoples = req.session.testAnsPeople || null;
	res.locals.status=req.session.status || null;
	next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/events', events);
app.use('/tests', tests);
app.use('/answers', answers);
app.use('/admin',admin);

app.set('port', (process.env.PORT || 3001));

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});