---
title: 'Preventing Mutation Brute-Force'
description: 'Learn how to block a kind of brute-force attack on a GraphQL authentication mutation.'
category: 'Authorization'
difficulty: 'easy'
owasp: 'API2:2023'
authors: ['escape']
---

Because the authentication mechanisms are exposed and complex, they are a target of choice for attackers. This lesson will show you how lesser-known GraphQL features can be used against your application.

Start the GraphQL server with `npm install` and `npm start` to get started.

## GraphQL Aliasing

Aliasing is a GraphQL feature allowing a developer to rename a field in the resulting object. For example, the following query:

```graphql
query {
  myAlias: users {
    name
  }
}
```

Will return the following object:

```json
{
  "data": {
    "myAlias": [
      {
        "name": "alice"
      }
    ]
  }
}
```

In the results, the field is now named `myAlias` instead of its original name `users`. This also allows a developer to query the same field several times, for different purposes:

```graphql
query {
  users {
    name
    myAlias: name
  }
}
```

This query will show `"alice"` twice in the results.

An attacker can exploit aliasing to run the same mutation several times:

```graphql
mutation {
  attempt1: login(name: "alice", password: "password1")
  attempt2: login(name: "alice", password: "password2")
  attempt3: login(name: "alice", password: "password3")
  attempt4: login(name: "alice", password: "password4")
  attempt5: login(name: "alice", password: "password5")
  # ...
}
```

An attacker is able to send several login attempts in a single request, effectively brute-forcing Alice's password.

## Installing GraphQL Armor

[GraphQL Armor](https://github.com/Escape-Technologies/graphql-armor) is a library that helps you protect your GraphQL API from malicious queries and mutations. It runs on all major GraphQL engines without configuration, and adds various security features to your GraphQL API.

This attack is one of the many that GraphQL Armor can protect you from.

Your goal is to install GraphQL Armor and protect your server from the attack: install GraphQL Armor with `npm install @escape.tech/graphql-armor`.

Having GraphQL Armor to work is as simple as two lines of code:

```js
import { ApolloArmor } from '@escape.tech/graphql-armor';

// Instantiate GraphQL Armor
const armor = new ApolloArmor({
  // Completely disable aliases for this lesson
  maxAliases: { n: 0 },
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Add the protections to the server
  ...armor.protect(),
});
```

You can try to re-run the attack, it should now fail, with an error stating that your query contains too many aliases. **Our server is now protected from aliasing brute-force!** You can read more about GraphQL Armor and all its protections [on GitHub](https://github.com/Escape-Technologies/graphql-armor).
