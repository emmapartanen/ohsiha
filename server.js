const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');

const db = require('./database');
const authHelpers = require('./_helpers');
const service = require('./service');

// *** HTTP ***

const hostname = 'localhost';
const port = 3000;

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));

// Set up  Handlebars
server.engine('handlebars', exphbs({ defaultLayout: 'main' }));
server.set('view engine', 'handlebars');

// Passport initializing
server.use(passport.initialize());
server.use(passport.session());
server.use(cookieParser());
server.use(express.static('public'));

// Pasport config
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  db('users').where({ id }).first()
  .then((user) => { done(null, user); })
  .catch((err) => { done(err, null); });
});

passport.use(new LocalStrategy((username, password, done) => {
  db('users').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false);
    if (!authHelpers.comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));

// ***Routes:***

// Login
server.get('/login', (req, res) => {
  res.render('login');
});

server.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }),
  (req, res) => {
    // If this function gets called, authentication was successful.
  }
);

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

// Register
server.post('/register', (req, res, next)  => {
  return authHelpers.createUser(req, res)
  .then((response) => {
    passport.authenticate('local', (err, user, info) => {
      if (user) { handleResponse(res, 200, 'success'); }
    })(req, res, next);
  })
  .catch((err) => { handleResponse(res, 500, 'error'); });
});

// Homepage
server.get('/', async (req, res) => {
// moviename: 'The Shawshank Redemption',director: 'Frank Darabont',year: 1994, toprating: 1
  const menus = await service.getDinners();

  const results = await db.select('moviename', 'year').from('movies').orderBy('toprating');
  
  res.render('home', {
    siteList: results,
    helpers: {
      makeList: (list) => {
        let text = '<ol>';

        _.forEach(list, (site) => {
          text += '<li>' + site.moviename + ' (' + site.year + ') </li>';
        });

        text += '</ol>';

        return text;
      },
    },
  });
});

server.post('/postComment', (req, res) => {
  console.log(req.body)
  db('comments').insert({
    // comments: 'id', authorId', 'postDate', 'movieId', body
    authorId: 1,
    movieId: 1,
    body: req.body.comment,
  })
  .then((results) => res.send(results));
});

server.delete('/deleteComment', (req, res) => {
  // poista kommentti
});

server.put('/editComment', (req, res) => {
  // muokkaa
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
