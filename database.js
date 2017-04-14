const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'emma',
    password: 'emmabeema',
    database: 'ht_db',
    charset: 'utf8',
  },
  pool: { min: 0, max: 5 },
});

db.schema.hasTable('users')
.then((exists) => {
  if (!exists) {
    db.schema.createTable('users', (t) => {
      t.increments('id').primary();
      t.string('username');
      t.string('password');
    })
    .then(() => db('users').insert(
      {
        username: 'testi',
        password: 'testi',
      }
    ));
  }
});

db.schema.hasTable('comments')
.then((exists) => {
  if (!exists) {
    db.schema.createTable('comments', (t) => {
      t.increments('id').primary();
      t.integer('authorId').references('id').inTable('users');
      t.dateTime('postDate').defaultTo(db.raw('NOW()'));
      t.integer('movieId').references('id').inTable('movies');
      t.string('body');
    })
    .then(() => console.log('Comments-table created'));
  }
});

db.schema.hasTable('movies')
.then((exists) => {
  if (!exists) {
    db.schema.createTable('movies', (t) => {
      t.increments('id').primary();
      t.string('moviename');
      t.string('director');
      t.integer('year');
      t.integer('toprating');
    })
    .then(() => db('movies').insert([
      {
        moviename: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        year: 1994,
        toprating: 1,
      },
      {
        moviename: 'The Godfather',
        director: 'Francis Ford Coppola',
        year: 1972,
        toprating: 2,
      },
      {
        moviename: 'The Godfather: Part II',
        director: 'Francis Ford Coppola',
        year: 1974,
        toprating: 3,
      },
      {
        moviename: 'The Dark Knight',
        director: 'Christopher Nolan',
        year: 2008,
        toprating: 4,
      },
      {
        moviename: '12 Angry Men',
        director: 'Sidney Lumet',
        year: 1957,
        toprating: 5,
      },
      {
        moviename: "Schindler's List",
        director: 'Steven Spielberg',
        year: 1993,
        toprating: 6,
      },
      {
        moviename: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        year: 1994,
        toprating: 7,
      },
      {
        moviename: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson',
        year: 2003,
        toprating: 8,
      },
      {
        moviename: 'Il buono, il brutto, il cattivo',
        director: 'Sergio Leone',
        year: 1966,
        toprating: 9,
      },
      {
        moviename: 'Fight Club',
        director: 'David Fincher',
        year: 1999,
        toprating: 10,
      },
    ]));
  }
});

module.exports = db;
