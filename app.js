  const express = require('express');
  const passport = require('passport');
  const cookieParser = require('cookie-parser');
  const session = require('express-session');
  const bodyParser = require('body-parser');
  const app = express();

// ==================
  const FacebookStrategy = require('passport-facebook').Strategy;
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const GitHubStrategy = require('passport-github2').Strategy;


  app.set('view engine', 'ejs');
  app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport session setup.
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });


  app.use(cookieParser());
  require('dotenv').config()

  
  app.set('views', __dirname + '/views');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(__dirname + '/public'));



// google passport======================================
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
passport.authenticate('google',  { successRedirect : '/', failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/');
}
);

//facebook passport ==========================================================================
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}

));


app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook',  { 
  failureRedirect: '/login',
  successRedirect : '/'
}),

);


// github passport ==============================

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', { 
    failureRedirect: '/login',
    successRedirect : '/'
   }),
);

// ============================================

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

// ============================================

app.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { 
     // return next(err); 
     console.log(err)
    }
    res.redirect('/');
  });

});

app.listen(3000, () => console.log(`Server at port 3000 ${process.env.TESTE}`));