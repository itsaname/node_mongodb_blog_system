var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bae = require('./bae');

var app = express();

var User = require('./models/users');

var index = require('./routes/index');
var signup = require('./routes/signup');
var login_email = require('./routes/login_email');
var login = require('./routes/login');
var get_logout = require('./routes/get_logout');
var post_posts = require('./routes/post_posts');
var post_comment = require('./routes/post_comment');
var post_vote = require('./routes/post_vote');
var post_delate_comment = require('./routes/post_delate_comment');
var post_title_modify = require('./routes/post_title_modify');
var post_tag_delete = require('./routes/post_tag_delete');
var post_tag_add = require('./routes/post_add_tag');
var post_content_modify = require('./routes/post_content_modify');
var post_watcher = require('./routes/post_watcher');
var get_single = require('./routes/get_single');
var post_get_10 = require('./routes/post_get_10');
var span_to_svg = require('./routes/span_to_svg');
var get_download = require('./routes/get_download');
var validate_email = require('./routes/validate_email');

//引入自定义方法contains，用来判断一个元素是否是数组的某个元素。contains(array, element);
//如果包含就返回true，不包含返回false。
var contains = require('./methods/array_contains');

/*var a = [1,2,3,4,5];
console.log(contains(a, 6) + ' test');*/

//把特定方法引入视图层
app.locals.moment = require('moment');
app.locals.contains = contains;

//var url = 'mongodb://mongo.duapp.com:8908/xgQLEdSsexdigfKfZxwj';
//var user = '78b39e5c37054e82865b9d2bda504946';
//var pas = 'd61d4f7285e44b7083000c287f65074f';

//mongoose连接主机：127.0.0.1，端口：12345，数据库：blog
//mongoose.connect( url ,{user:user,pass:pas});
bae.getConnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave:false,
  saveUninitialized:false, 
  cookie: { maxAge: 3600000 },
  store:new MongoStore({
            mongooseConnection: bae.mongoose.connection 
            })
}));

app.use(function(req, res, next){
  if(req.session.loggedIn){
        res.locals.authenticated = true;
        User.findById(req.session.loggedIn, function(err, doc){
            if(err) return next(err);
            res.locals.me = doc;
            next();
        });
  } else {
        res.locals.authenticated = false;
        next();
  }
});

app.use('/', index);
app.use('/', signup);
app.use('/', login_email);
app.use('/', login);
app.use('/', get_logout);
app.use('/', post_posts);
app.use('/',post_comment);
app.use('/', post_vote);
app.use('/', post_delate_comment);
app.use('/', post_title_modify);
app.use('/', post_tag_delete);
app.use('/', post_tag_add);
app.use('/', post_content_modify);
app.use('/', post_watcher);
app.use('/', get_single);
app.use('/', post_get_10);
app.use('/', span_to_svg);
app.use('/', get_download);
app.use('/', validate_email);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
