---
title: 'Object-Level Authorization'
description: 'Learn how to properly setup object-level authorization in GraphQL.'
category: 'Authorization'
difficulty: 'easy'
owasp: 'API1:2023'
introduction: true
authors: ['escape']
---

If this is the first lesson you are doing, welcome! This learning platform is developed conjointly by ['escape'](https://escape.tech/) and [the open-source community](https://github.com/Escape-Technologies/academy). All the content of this site is open-source and contributions are welcome.

This lesson is about properly setting up object-level authorization in GraphQL with Apollo. The server code is given, with authentication developed following [Apollo's recommandations](https://www.apollographql.com/docs/apollo-server/security/authentication/). Small oversights have made **the authorization mechanism vulnerable**. Our goal is to exploit it and then fix it.

## The vulnerable server

The GraphQL server of this lesson is made of 4 files:

- `index.js` is the entry point of the server. It creates the Apollo server with a schema and starts it.
- `resolvers.js` contains the resolvers of the GraphQL schema.
- `context.js` contains the function that creates the context of each request. It allows authentication of the current user.
- `database.js` contains a mock database of users and posts.

The data served by the GraphQL server is a list of posts, each post having an author. Let's take a look at the data served by starting the server:

- Open a new terminal.
- Run `npm install` to install the dependencies.
- Run `npm start` to start the server. It starts in development mode, so it will restart automatically when you make changes to the code.

You should now see GraphQL IDE with the following query:

```graphql
query {
  users {
    name
    posts {
      title
    }
  }
}
```

Running this query allows you to see the list of users and their **published** posts. Is there a way to access the **unpublished** posts of a user?

## Missing authorization

As an attacker, the first step is usually to collect information about the target. Let's try to add all the fields possible to the query above:

```graphql
query {
  users {
    id # One more field here
    name
    posts {
      id # Two more there
      published
      title
    }
  }
}
```

We now notice something very interesting: ids are sequential. This means that we can easily guess the id of a post: here `2` is missing, let's try to access it:

```graphql
query {
  post(id: "2") {
    id
    authorId
    title
    published
  }
}
```

**It worked!** In all its glory, here is the unpublished post:

```json
{
  "data": {
    "post": {
      "id": "2",
      "authorId": "1",
      "title": "<work in progress>",
      "published": false
    }
  }
}
```

Our server lacks object-level authorization, and this allows any attacker to access unpublished data. Let's fix it!

## Limiting access to published posts

Since the beginning of this lesson, we issue requests as Eve, whose id is 3. The server identify us thanks to the `Authorization: Bearer 3` header, defined in the bottom left corner of the IDE. Eve should not be able to access Alice's unpublished posts.

Our authentication mechanism is rather simple, but enough for this lesson. It is implemented in `context.js`. The `getContext` functions returns either an object containing the current user, or an empty if the user is not authenticated. This object is then passed to the resolvers as the `context` argument, in third position.

We already have a resolver that relies on authentication: `me`. You can see that you are properly identified as Eve by running the following query:

```graphql
query {
  me {
    id
    name
  }
}
```

We can use the context argument to check if the user accessing an unpublished post is its author. If not, we can return an error. Let's do that in `resolvers.js`:

```js
export const Query = {
  // ...

  // Get the query context as the third argument
  post: (_, args, context) => {
    const post = getPost(args.id);
    if (!post) throw new GraphQLError('Post not found');

    // Refuse to return the post if it is unpublished and the user is not its author
    if (!post.published && post.authorId !== context.user?.id)
      throw new GraphQLError('Unauthorized');

    return post;
  },
};
```

Running this query as Eve (`Authorization: Bearer 3`) will now throw an error, whereas running it as Alice (`Authorization: Bearer 1`) will properly return the post. **No more unauthorized access!**
