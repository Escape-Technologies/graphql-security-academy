---
title: JSON Injection
---

<script>
  import Task from '$lib/Task.svelte';
  import RunCommand from '$lib/RunCommand.svelte';
</script>

# JSON Injection with Prisma

Using `JSON` as a GraphQL input object can lead to vulnerabilities. This tutorial will show how one can exploit a `JSON` input object to **perform arbitrary SQL queries** with [Prisma](https://www.prisma.io) ORM, and **how to prevent it.**

This lesson does not currently work in the browser for security reasons. You can run it locally with the following steps:

- Clone the repository: `git clone https://github.com/Escape-Technologies/learn.escape.tech.git`
- Run `cd learn.escape.tech/packages/lessons/json-injection`
- Install dependencies with `yarn install`
- Continue from here with `yarn start`, `yarn exploit`, etc.

_More details on [prisma#17710](https://github.com/prisma/prisma/issues/17710)_

## The vulnerability

This tutorial contains a GraphQL API that uses [Prisma](https://www.prisma.io) ORM to perform search queries in a SQLite database. It has one single resolver, `findUsers`, that takes a `JSON` input object as argument. The `JSON` input object is used to filter the users in the database.

```graphql
# GraphQL schema
type Query {
  findUsers(where: JSON): [User]
  #                ^^^^ arbitrary JSON input object
}
```

```js
// GraphQL resolver
Query: {
  findUsers: (_, { where }) => prisma.user.findMany({ where }),
  //               ^^^^^ arbitrary object...
  //                  ...leading to arbitrary queries ^^^^^
}
```

Our database table contains more columns than what the API exposes. Indeed, there is an `apiKey` used for authentication purposes, and while an attack cannot read it directly, it can leverage Prisma's API to get it.

```graphql
# Legitimate query
query {
  findUsers(where: { email: { endsWith: "@example.com" } }) {
    email
  }
}

# Malicious query
query {
  findUsers(where: { apiKey: { startsWith: "0" } }) {
    email
  }
}
```

<Task>

- Start the API with `npm install` and `npm start`. <RunCommand cmd="npm install && npm start" on:cmd>▶️</RunCommand>
- Run the exploit in `exploit/index.ts` with `npm run exploit`. <RunCommand cmd="npm run exploit" on:cmd>▶️</RunCommand>

</Task>

## How to prevent it

We will use [zod](https://zod.dev/) to validate the `JSON` input object. Zod is a TypeScript library that allows to define a schema for a JavaScript object, and to validate it.

```ts
Query: {
  findUsers: (_, { where }) => {
    // Allows equality, contains, startsWith and endsWith filters on columns
    const filterSchema = z.union([
      z.string(),
      z
        .object({
          contains: z.string(),
          startsWith: z.string(),
          endsWith: z.string(),
        })
        .partial(),
    ]);
    // Restrict to firstName, lastName and email
    const whereSchema = z
      .object({
        firstName: filterSchema,
        lastName: filterSchema,
        email: filterSchema,
      })
      .partial();

    // Validate the input object
    const results = whereSchema.safeParse(where);

    if (results.success) {
      // Use the safe version of the input objects
      return prisma.user.findMany({ where: results.data });
    } else {
      // Return an error in case the input object is invalid
      return new GraphQLError('Validation error');
    }
  },
}
```

<Task>

- Install zod with `npm install zod`. <RunCommand cmd="npm install zod" on:cmd>▶️</RunCommand>
- Write a zod schema that allows searching with `email`, `firstName` and `lastName` fields, but not others.

</Task>

You can now try to run the exploit again. It should not work anymore since Zod strips all unknown fields like `apiKey`.
