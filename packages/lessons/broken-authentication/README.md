---
title: 'Prevent Mutation Brute-Force Attacks'
description: 'Understand how to mitigate brute-force attacks targeting GraphQL authentication mutations for enhanced security.'
category: 'Access Control'
difficulty: 'Easy'
owasp: 'API2:2023'
authors: ['escape']
---

Because the authentication mechanisms are exposed and complex, they are a target of choice for attackers. This lesson will show you how lesser-known GraphQL features can be used against your application.

## Getting Started

To begin the lesson, we need to start the GraphQL server. In order to do so, we first need to [install all modules listed as dependencies](https://docs.npmjs.com/cli/v11/commands/npm-install#description) in `package.json` on a terminal window:

```shell
npm install
```

Once that process execution is completed, we can start the GraphQL server:

```shell
npm start
```

This command will start the GraphQL server and open [Yoga GraphiQL](https://the-guild.dev/graphql/yoga-server/docs/features/graphiql), where we will run the GraphQL queries of this lesson.

## Running GraphQL Queries

In the GraphiQLtab that opened, we can see a basic query is already provided:

```graphql
query {
  users {
    name
  }
}
```

Running the query will return the following object:

```json
{
  "data": {
    "users": [
      {
        "name": "alice"
      }
    ]
  }
}
```

## GraphQL Aliasing

[Aliasing](https://graphql.org/learn/queries/#aliases) is a GraphQL feature that allows a developer to use an `alias` for any `field name` in the query, which results in the field being renamed in the resulting object. For example, aliasing the `users` field in the first query would look like: 

```graphql
query {
  myUsersAlias: users {
    name
  }
}
```

And running the query will return the following object:

```json
{
  "data": {
    "myUsersAlias": [
      {
        "name": "alice"
      }
    ]
  }
}
```

Comparing these results to the results of the first query we ran, we can see that the `users` field is now named `myUsersAlias` in the returned object. 
Aliasing also allows a developer to query the same field several times, for different purposes:

```graphql
query {
  users {
    name
    myNameAlias: name
  }
}
```

This query will show `"alice"` twice in the results.

```json
{
  "data": {
    "users": [
      {
        "name": "alice",
        "myNameAlias": "alice"
      }
    ]
  }
}
```

## Exploiting Aliasing

An attacker looking to obtain a user's login details, can exploit aliasing together with a [mutation](https://graphql.org/learn/mutations/) to run the same attempt several times in serial order; that is, to run the first attempt, wait until it's finished processing, then run the following line:

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

In this way, an attacker is able to send several login attempts in a single request, effectively brute-forcing Alice's password.

## Installing GraphQL Armor

[GraphQL Armor](https://github.com/Escape-Technologies/graphql-armor) is a library that helps you protect your GraphQL API from malicious queries and mutations. It runs on all major GraphQL engines without configuration, and adds various security features to your GraphQL API.

The attack in this lesson is one of the many that GraphQL Armor can protect you from.

Your goal is to install GraphQL Armor and protect your server from the attack: install GraphQL Armor with: 

```shell
npm install @escape.tech/graphql-armor
```

Once the installation is completed, getting GraphQL Armor to work in our project is as simple as adding a few lines of code to our `ìndex.js`:

```js
// First: Import GraphQL Armor
import { ApolloArmor } from '@escape.tech/graphql-armor';

// Second: Instantiate GraphQL Armor
const armor = new ApolloArmor({
  // Completely disable aliases for this lesson
  maxAliases: { n: 0 },
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Third: Add the protections to the ApolloServer
  ...armor.protect(),
});
```

You can try to re-run the attack, it should now fail, with an error stating that your query contains too many aliases. **Our server is now protected from aliasing brute-force!** You can read more about GraphQL Armor and all its protections [on GitHub](https://github.com/Escape-Technologies/graphql-armor).

> Need extra help to get started with GraphQL Armor? Check out [GraphQL Armor docs](https://escape.tech/graphql-armor/docs/getting-started).
