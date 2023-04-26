import sqlite3 from 'sqlite3';

// Create a new database in memory
const db = new sqlite3.Database(':memory:').run(
  'CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, admin INTEGER)'
);

/** Returns all users. */
export const getUsers = async () =>
  new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

/** Creates a new user with the credentials provided. */
export const createUser = async (email, password) =>
  new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (email, password, admin) VALUES ('${email}', '${password}', 0)`,
      (err) => {
        if (err) reject(err);
        else resolve(undefined);
      }
    );
  });

/** Finds a user by their email. */
export const getUserByEmail = async (email) =>
  new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users WHERE email = '${email}'`, (err, rows) => {
      if (err) reject(err);
      if (rows.length === 0) reject(new Error('No user found'));
      else resolve(rows[0]);
    });
  });
