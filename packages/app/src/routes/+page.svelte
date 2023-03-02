<script lang="ts">
  import { WebContainer, type FileSystemTree } from '@webcontainer/api';
  import { onDestroy } from 'svelte';

  const files = {
    src: {
      directory: {
        'index.ts': {
          file: {
            contents: `import { createSchema, createYoga } from 'graphql-yoga';
import { renderGraphiQL } from '@graphql-yoga/render-graphiql'
import { createServer } from 'node:http';
import { schema } from './schema.ts';

const yoga = createYoga({
  schema,
  renderGraphiQL,
  graphiql: { defaultQuery: '{ hello }' }
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})`,
          },
        },
        'schema.ts': {
          file: {
            contents: `import { createSchema } from 'graphql-yoga';

export const schema = createSchema({
  typeDefs: /* GraphQL */ \`
    type Query {
      hello: String
    }
  \`,
  resolvers: {
    Query: {
      hello: () => 'Hello from Yoga!'
    }
  }
});`,
          },
        },
      },
    },
    'package.json': {
      file: {
        contents: `{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "@graphql-yoga/render-graphiql": "latest",
    "graphql": "latest",
    "graphql-yoga": "latest",
    "tsx": "latest"
  },
  "scripts": {
    "start": "tsx watch --clear-screen=false src/index.ts"
  }
}`,
      },
    },
  } satisfies FileSystemTree;

  const createContainer = async () => {
    let container: WebContainer | undefined;
    onDestroy(() => {
      container?.teardown();
    });
    container = await WebContainer.boot();
    await container.mount(files);
    return container;
  };
</script>

{#await Promise.all([import('./Editor.svelte'), createContainer()])}
  <div class="loading">
    <h1>Loading...</h1>
  </div>
{:then [editor, container]}
  <svelte:component this={editor.default} {container} />
{:catch error}
  <pre>{error}</pre>
{/await}

<style lang="scss">
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>
