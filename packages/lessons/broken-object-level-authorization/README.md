---
title: 'Implement Object-Level Authorization'
description: 'Master the essentials of object-level authorization for secure data access and improved application security.'
category: 'Access Control'
difficulty: 'Easy'
owasp: 'API1:2023'
authors: ['escape']
---

If this is your first lesson, welcome! This learning platform is jointly developed by [Escape](https://escape.tech/) and [the open-source community](https://github.com/Escape-Technologies/graphql-security-academy). All of the content on this site is open-source, and contributions are welcome.

This lesson is about GraphQL object-level authorization using Apollo. Server code is provided, and authentication generally follows [Apollo's recommendations](https://www.apollographql.com/docs/apollo-server/security/authentication/). However, small oversights make **the authorization mechanism vulnerable**. The goal of this lesson is to exploit the application and then fix it.

## The vulnerable server

The GraphQL server used in this lesson consists of 4 files:

- `index.js` is the server entry point. It creates and starts the Apollo server with the given schema.
- `resolvers.js` contains the GraphQL resolvers.
- `context.js` defines request context including user authentication.
- `database.js` contains a mock database of users and posts.

The GraphQL server returns a list of posts, each post having an author. Let's look at the data returned by starting the server.

- Open a new terminal by selecting the **New terminal** tab.
- Run `npm install` to install the dependencies.
- Run `npm start` to start the server in development mode, which then automatically restarts when you change the code.

You should now see the GraphQL IDE populated with the following query:

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

Running this query results in a list of users and their **published** posts. Is there a way to access the **unpublished** posts of a user?

## Missing authorization

As a first step, attackers usually collect as much information about their target as possible. In GraphQL there are various methods available, including retrieving the GraphQL introspection schema if introspection is enabled or by simply guessing fields. For example, it wouldn't be surprising to find a field named **id**, **clientId**, **invoiceId**, or **accountId** in any schema. As this is a vulnerability example, we'll assume that an attacker has identified several other fields.  Let's try a new query with some additional fields:

```graphql
query {
  users {
    id # added field
    name
    posts {
      id # added field
      published # added field
      title
    }
  }
}
```

With the additional data returned, we see that that post ids are squential - very interesting. Even if the post id was not sequential, it's easy for an attacker to enumerate fixed length fields. Non-sequential ids are security by obscurity, which isn't secure, but certainly an added step for an attacker. Because this is an example, we'll stick with sequential ids. Looking at the returned data, it's obvious that post #2 is missing. As an attacker would do, let's try to access it:

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

**It worked!** Here is the unpublished post:

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

Although the post has not been published, any user or attacker can access it because our server lacks object-level authorization. Let's fix it!

## Limiting access to published posts

Since the beginning of this lesson, we have been issuing requests as Eve, whose id is 3. The server identies us thanks to the `Authorization: Bearer 3` header defined in the bottom left corner of the IDE. However, Eve, or any other user except for Alice, should not be able to access Alice's unpublished posts.

Our authentication mechanism is rather simple as implemented in `context.js`, but enough for this lesson. The `getContext` function returns either an object containing the current user, or an empty object if the user is not authenticated. This object is then passed to the resolvers as the `context` argument.

We already have a resolver that relies on authentication: `me`. You can see that you are correctly identified as Eve by running the following query:

```graphql
query {
  me {
    id
    name
  }
}
```

To fix the broken authorization, we can use the context argument to check if the user accessing an unpublished post is the author. If not, we can return an error. Let's edit `resolvers.js` to fix the authorization vulnerability:

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

Running the same query as Eve (`Authorization: Bearer 3`) will now throw an error, whereas running it as Alice (`Authorization: Bearer 1`) will correctly return the post. **No more unauthorized access!**

Want to learn further about Access Control? Check out [this article](https://escape.tech/blog/authentication-authorization-access-control/).
