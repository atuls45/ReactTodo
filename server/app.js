let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

let indexRouter = require('./routes/index');
let usersController = require('./controller/user');
let taskController = require('./controller/tasks');
let registerController = require('./controller/register');

const { initialise } = require('./config/sequelize');
(async () => {
  await initialise();
})();
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


let store = new MemoryStore({
  ttl: app.get('inactivityTimeout') * 1000 //Default one hour
});

// Tell express to store the serialized user in the session
app.use(
  session({
    secret: 'ItsSecret',
    store: store,
    proxy: true,
    name: 'react.session',
    cookie: {
      httpOnly: true,
      //secureProxy: app.SSL,
      secure: 'auto',
      maxAge: app.get('inactivityTimeout') * 1000 // 1 hour
    },
    saveUninitialized: false,
    rolling: true, // to increase the expiration date of the session cookie
    resave: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./middleware/passport').init(app);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.post('/users/authenticate', (req, res, next) => {
  passport.authenticate('local', (err, passportUser, info) => {
    console.log(err, passportUser, info);
    if (err || info) {
      return res.status(500).send(Object.assign({
        status: 500
      }, err || info));
    }
    return res.json(passportUser);
  })(req, res, next);
});

let excludedUrls = ['/users/authenticate', '/registers'];

app.all('*', function (req, res, next) {
  console.log('req.isAuthenticated() here===', req.isAuthenticated());
  console.log('req.url here===', req.url);
  let isExcluded = false;
  for (let url in excludedUrls) {
    if (req.url.indexOf(url) === 0) {
      isExcluded = true;
      break;
    }
  }

  if (!req.isAuthenticated() && !isExcluded) {
    req.logout();
    return res.json('Not Authorised');
  }
  return next();
});

app.use('/logout', (req, res, next) => {
  req.session.destroy();
  req.logout();
  res.cookie('ai.session', '');
  res.clearCookie('_csrf');
  console.log('Session destroyed and user logged out', req.user);
  let text = {
    msg: "successfully logout"
  }
  res.json(text);
});
app.use('/registers', registerController);
app.use('/users', usersController);
app.use('/tasks', taskController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
