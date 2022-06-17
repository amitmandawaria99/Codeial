//1) Setting up express server
const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const app = express();
//Calling view-helper function for asset path
require('./config/view-helpers')(app);
const port = 8000;

//6) Installing and acquiring express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');

//9)Setting configuration for mongoose in config folder and requiring here (Connecting to database)
const db = require('./config/mongoose');

//11)Using cookies
const cookieParser = require('cookie-parser');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//13)Permanantly storing session in db
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


//setup the chat server to be used with socket.io
//Setting up another server for chat engine and passing our app to it
const chatServer = require("http").Server(app);
//setting up configuation for setting sockets on the chat server
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000, function (error) {
  if (error) {
    console.log('error in setting up chat Server');
  } else {
    console.log('chat server is listening on port 5000');
  }
});


//For logging purppose
const morgan = require('morgan')
const path = require('path');
const rfs = require('rotating-file-stream');

const prod_assets = require("./config/view-helpers")(app);

//setting config for using sass(it has to be written before the server starts so that it can compile all the sass files into css)  
if (env.name == 'development') {
  app.use(
    sassMiddleware({
    src: path.join(__dirname, env.asset_path, 'scss'),
    dest: path.join(__dirname, env.asset_path, 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
  }));
}


// setup the logger
app.use(morgan(env.morgan.mode, env.morgan.options));

//to read data from url(send in post method)
//10)Setting middleware for decoding the post request
app.use(express.urlencoded());

//After requiring cookies we have to use this middleware for using cookies
app.use(cookieParser());

//7)Linking static files
app.use(express.static(path.join(__dirname, env.asset_path)));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
//extract style and script from sub pages and place them in head
app.set('layout extractStyles' ,true);
app.set('layout extractScripts' ,true);


//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//using express session to encrypt user data and stores in the cookie (This cookie is then stored in database)
app.use(
  session({
  name: 'codeial',
  secret: env.session_cookie_key,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 100
  },
  store: MongoStore.create(
    {
      mongoUrl: '/mongodb://localhost/codeial_development',
      autoRemove: 'disabled'
    },
    function (err) {
      console.log(err || 'connect-mongodb setup OK');
    }
  )
}));

//initialising passport and using session
app.use(passport.initialize());
app.use(passport.session());

//setting user to locals of response
app.use(passport.setAuthenticatedUser);

//after session is used(it uses session cookie to store flash message) set it up to be used 
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes/index'));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});