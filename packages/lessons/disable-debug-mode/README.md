---
title: 'Disable Debug Mode for Production'
description: 'Explore the importance of turning off debug mode in a production environment to safeguard against unwanted information disclosure.'
category: 'Information Disclosure'
difficulty: 'Easy'
owasp: 'API7:2023'
authors: ['escape']
---

Apollo Server enables debug mode by default, which is useful for development, but **can be a security risk in production.** In this lesson, you'll learn how to disable debug mode.

## What is Debug Mode?

This lesson starts a mini GraphQL server, which runs directly in your browser using Apollo's default settings.

- Open a new terminal by selecting the *New terminal* tab
- Install the server by running `npm install`.
- Start the server with `npm start`.

You should see a GraphQL IDE, allowing you to run queries and mutations against the server. Our schema is quite concise, consisting of a single `Lesson` type.

```graphql
type Lesson {
  title: String!
  points: Int!
}
```

Unfortunately, our _database_ contains an error: one record includes an undefined `points` field, which is incompatible with our schema. Try querying the `lessons` field to see the error:

```graphql
query {
  lessons {
    title
    points
  }
}
```

You should see a long error message, which includes the following:

- The cause of the error: `Cannot return null for non-nullable field Lesson.points.`
- A stack trace, which shows the location of the error in the code.

The stack trace contains valuable **internal server** information, including details about code architecture and packages. This excess information is **a security risk in production.**

## Disabling Debug Mode

Fortunately for us, turning off Debug Mode in production is as easy as a simple configuration change. Most JavaScript software designed for Node.js uses the [`NODE_ENV`](https://nodejs.dev/en/learn/nodejs-the-difference-between-development-and-production/) environment variable to specify the environment in which the application is running, and its use is [usually considered good practice.](https://12factor.net/config) Apollo Server is no exception, so we [will omit stack traces by setting `NODE_ENV` is to `production`](https://www.apollographql.com/docs/apollo-server/data/errors/#omitting-or-including-stacktrace)

The GraphQL server in this lesson uses a `.env` file to set environment variables at runtime. If your server runs in a container, you should use [environment variables](https://docs.docker.com/compose/environment-variables/) instead.

To turn off debug mode set `NODE_ENV=production` in the `.env` file and restart the server. Rerun the previous query:

```graphql
query {
  lessons {
    title
    points
  }
}
```

The error message should now be much shorter, and the stack trace should be gone. **No more stack traces in production!**
