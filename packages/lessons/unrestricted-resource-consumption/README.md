---
title: 'Unrestricted Resource Consumption'
description: 'Learn how to block expensive queries with GraphQL Armor, preventing denial-of-service (DoS) attacks.'
category: 'DoS'
points: 10
owasp: 'API4:2023'
introduction: true
---

# Unrestricted Resource Consumption

GraphQL engines ship without complexity limits by default, allowing you to ship complex applications rapidly, but also enabling attackers to perform expensive queries. Cycles in the graph can lead to arbitrarily deep queries, which cause degraded performance or even denial of service.

This lesson contains a _very_ simple social network with users and friends. Because users have friends and friends have friends, it is possible to construct a query that will cause the server to run out of memory:

```graphql
query {
  user(id: 1) {
    friends {
      friends {
        friends {
          friends {
            friends {
              # ... as deep as the attacker wants
            }
          }
        }
      }
    }
  }
}
```

Let's start this lesson by performing this attack:

- Install the server and its dependencies by running `npm install` in a terminal.
- Start the server by running `npm start` in a terminal. It starts in development mode, so it will restart automatically when you make changes to the code.

A GraphQL ID should open, use it to send a deep query to the server.

Note: the server is running directly inside your browser, don't make it crash!

## Installing GraphQL Armor

[GraphQL Armor](https://github.com/Escape-Technologies/graphql-armor) is a library that helps you protect your GraphQL API from malicious queries and mutations. It runs on all major GraphQL engines without configuration, and adds various security features to your GraphQL API.

This attack is one of the many that GraphQL Armor can protect you from.

Your second task is to install GraphQL Armor and protect your server from the attack: install GraphQL Armor with `npm install @escape.tech/graphql-armor`.

Having GraphQL Armor to work is as simple as two lines of code:

```js
import { ApolloArmor } from '@escape.tech/graphql-armor';

// Instantiate GraphQL Armor
const armor = new ApolloArmor();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Add the protections to the server
  ...armor.protect(),
});
```

Try running the following query now that you have Armor installed:

```graphql
query {
  user(id: 1) {
    friends {
      friends {
        friends {
          friends {
            friends {
              name
            }
          }
        }
      }
    }
  }
}
```

You should now see an error stating that your query is too deep.

The default limit is 6, which is enough for most applications. You can change it by passing a configuration object to `ApolloArmor`:

```js
// Set maximum depth to 10
const armor = new ApolloArmor({ maxDepth: { n: 10 } });
```

**Our server is now safe from arbitrary deep queries!** You can read more about GraphQL Armor and all its protections [on GitHub](https://github.com/Escape-Technologies/graphql-armor).
