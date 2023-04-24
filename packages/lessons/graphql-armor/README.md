---
title: GraphQL Armor
---

<script>
  import Task from '$lib/Task.svelte';
  import RunCommand from '$lib/RunCommand.svelte';
  import { createEventDispatcher } from 'svelte';

  let installed = false;
  let started = false;

  const dispatch = createEventDispatcher();
</script>

# GraphQL Armor

[GraphQL Armor](https://github.com/Escape-Technologies/graphql-armor) is a library that helps you protect your GraphQL API from malicious queries and mutations. It runs on all major GraphQL engines without configuration, and adds various security features to your GraphQL API.

This tutorial will show you how to install GraphQL Armor and what it can do for you.

## Unlimited query complexity

GraphQL engines ship without complexity limits by default, allowing you to ship complex applications rapidly, but also enabling attackers to perform expensive queries. Cycles in the graph can lead to arbitrarily deep queries, which cause degraded performance or even denial of service.

This tutorial contains a *very* simple social network with users and friends. Because users have friends and friends have friends, it is possible to construct a query that will cause the server to run out of memory:

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

This attack is one of the many that GraphQL Armor can protect you from.

<Task>

  Your first task is to perform the attack described above. You can use the GraphQL Playground to do this.

  - <input type="checkbox" checked={installed} disabled>
    Install dependencies with <samp>npm install<samp>
    <RunCommand cmd="npm install" on:cmd={({detail: cmd}) => {
      installed = true;
      dispatch('cmd', cmd);
    }}>▶️</RunCommand>
  - <input type="checkbox" checked={started} disabled>
    Run the server with <samp>npm start</samp>
    <RunCommand cmd="npm start" on:cmd={({detail: cmd}) => {
      started = true;
      dispatch('cmd', cmd);
    }}
    >▶️</RunCommand>
  - [ ] Send a deep query to the server


  Note: the server is running directly inside your browser, don't make it crash!

</Task>

## Installing GraphQL Armor

GraphQL Armor is a collection of plugins that prevent malicious queries such as the one you sent before.

<Task>

  Your second task is to install GraphQL Armor and protect your server from the attack.

  - [ ] Install GraphQL Armor with `npm install @escape.tech/graphql-armor`
  - [ ] Add `EnvelopArmorPlugin` to the list of plugins in `src/index.js`
  - [ ] Resend the query to the server and see that it is now protected

</Task>

Congratulations! 🎉

## Closing words

You can read more about GraphQL Armor and all its protections [on GitHub](https://github.com/Escape-Technologies/graphql-armor).
