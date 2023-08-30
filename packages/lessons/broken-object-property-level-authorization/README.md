---
title: 'Field-Level Authorization'
description: 'Learn how to properly setup authorization for GraphQL resolvers.'
category: 'Access Control'
difficulty: 'medium'
owasp: 'API4:2023'
authors: ['escape']
---

This lesson is about properly setting up object property level authorization in GraphQL with Apollo. The server code is given, with authentication developed following [Apollo's recommandations](https://www.apollographql.com/docs/apollo-server/security/authentication/). Our goal is to protect sensitive data from leaking to unauthorized users.

The GraphQL server of this lesson has the same structure as _Broken Object-Level Authorization_. The data it severs is a list of users, with various details about them. Let's take a look at the data served by starting the server:

- Open a new terminal.
- Run `npm install` to install the dependencies.
- Run `npm start` to start the server. It starts in development mode, so it will restart automatically when you make changes to the code.

You should now see GraphQL IDE with the following query:

```graphql
query {
  users {
    name
    location
  }
}
```

Running this query allows you to see the list of users and their locations. Because `location` is a sensitive data we want to protect, we want to make sure that only the user themselves can see it.

```graphql
# This should work
query {
  me {
    name
    location
  }
}

# This should not
query {
  users {
    name
    location
  }
}
```

We will improve the `location` resolver to make sure that only the user themselves can see their location:

```js
import { GraphQLError } from 'graphql';

export const User = {
  // ...
  location: (user, args, context) => {
    // Check if the user trying to access the location is the user themselves
    if (user.id !== context.user?.id) throw new GraphQLError('Not authorized');
    return user.location;
  },
};
```

And _voilà!_ The `location` field is now protected from leaking to unauthorized users. Try running the queries above to see the difference: trying to access another user's location will result in an error.
