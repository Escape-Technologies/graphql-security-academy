---
title: 'Disabling Debug Mode'
description: 'Learn how to disable debug mode in production, to prevent information disclosure.'
category: 'Configuration'
points: 10
owasp: 'API7:2023'
introduction: true
authors: ['escape']
---

Apollo Server has its debug mode enabled by default. This is useful for development, but **it can be a security risk in production.** In this lesson, you'll learn how to disable debug mode in production.

## What is Debug Mode?

This lesson contains a mini GraphQL servers that runs directly in your browser. It comes with Apollo's default settings.

- Install the server by running `npm install` in a terminal.
- Start the server with `npm start`.

This will open a GraphQL IDE, allowing you to run queries and mutations against the server. Our schema is quite concise, and only contains a single `Lesson` type.

```graphql
type Lesson {
  title: String!
  points: Int!
}
```

Unfortunately, our _database_ contains an error: one of the values of `points` is undefined, which is incompatible with the schema. Try querying the `lessons` field to see the error:

```graphql
query {
  lessons {
    title
    points
  }
}
```

You should see a long error message containing the following:

- The cause of the error: `Cannot return null for non-nullable field Lesson.points.`
- A stack trace, which shows the location of the error in the code.

The stack trace contains precious information about the **internals of our server:** details about the code architecture, the packages used, etc. **This is a security risk in production.**

## Disabling Debug Mode

Fortunately for us, turning this off in production is only a matter of configuration. Most JavaScript software designed for Node.js adheres to the [`NODE_ENV`](https://nodejs.dev/en/learn/nodejs-the-difference-between-development-and-production/) environment variable, which is [usually considered as a good practice.](https://12factor.net/config) Apollo Server is no exception, and [will omit stack traces when it is set to `production`](https://www.apollographql.com/docs/apollo-server/data/errors/#omitting-or-including-stacktrace)

The GraphQL server of this lesson uses a `.env` file to set environment variables at runtime. If your server runs in a container, you should use [environment variables](https://docs.docker.com/compose/environment-variables/) instead.

Set `NODE_ENV=production` in the `.env` file, and restart the server. Rerun the previous query:

```graphql
query {
  lessons {
    title
    points
  }
}
```

The error message should now be much shorter, and the stack trace should be gone. **No more stack traces in production!**
