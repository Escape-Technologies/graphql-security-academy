---
title: 'Implement Resolver-Level Authorization'
description: 'Master techniques for setting up authorization specifically tailored for GraphQL mutations, enhancing both data integrity and security.'
category: 'Access Control'
difficulty: 'hard'
owasp: 'API5:2023'
authors: ['escape']
---

This lesson is about properly setting up function-level authorization in GraphQL with Apollo. The server code is given, with authentication developed following [Apollo's recommandations](https://www.apollographql.com/docs/apollo-server/security/authentication/). Small oversights have made **the authorization mechanism vulnerable**. Our goal is to exploit it and then fix it.

## The vulnerable server

The GraphQL server of this lesson has the same structure as _Broken Object-Level Authorization_. The data it severs is a list of users, each user authoring posts. Let's take a look at the data served by starting the server:

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

Running this query allows you to see the list of users and their posts.

You can also, when logged in (you should be logged in as Eve with `Authorization: Bearer 3`), create and delete posts:

```graphql
# Create a post
mutation {
  createPost(title: "New post from Eve") {
    id # This should return 3
    authorId
    title
  }
}

# And delete it
mutation {
  deletePost(id: "3")
}
```

## Missing authorization

While developing the `deletePost` mutation, the developer forgot to add authorization to the resolver. This means that anyone can delete any post, even if they are not the author. This is a **broken function-level authorization**.

You can try deleting Alice's and Bob's posts while logged in as Eve:

```graphql
mutation {
  alice: deletePost(id: "1")
  bob: deletePost(id: "2")
}
```

To prevent this, we need to add authorization to the resolver.

Our server already features a simple authentication mechanism. For instance, it is used when creating posts:

```js
export const Mutation = {
  // `context` contains a `user` key if the user is logged in
  createPost: (_, args, context) => {
    // If the user is not logged in, throw an error
    if (!context.user) throw new GraphQLError('Not authorized');
    // Otherwise, create the post with the current user as the author
    return createPost(args.title, context.user.id);
  },
  // ...
};
```

We can leverage `context.user` to ensure that the user that tries to delete the post is the author:

```js
import { getPost } from './database.js';

export const Mutation = {
  // ...
  deletePost: (_, args, context) => {
    const post = getPost(args.id);

    // If the user is not the author, throw an error
    if (post && post.authorId !== context.user?.id)
      throw new GraphQLError('Not authorized');

    return deletePost(args.id);
  },
};
```

You can try deleting Alice's post again, it won't work anymore. You can only delete your own posts, **our broken function-level authorization is now fixed!**
