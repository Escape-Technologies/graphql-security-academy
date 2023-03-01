<script lang="ts">
  import { WebContainer } from '@webcontainer/api';
  import stripAnsi from 'strip-ansi';
  import { onDestroy } from 'svelte';

  let value = 'Loading...';
  const files = {
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
    "start": "tsx watch index.ts"
  }
}`,
      },
    },
  };

  const createContainer = async () => {
    let container: WebContainer | undefined;
    onDestroy(() => {
      container?.teardown();
    });
    container = await WebContainer.boot();
    await container.mount(files);
    value = files['schema.ts'].file.contents;
    return container;
  };

  const save = (container: WebContainer) => async () => {
    await container.fs.writeFile('/schema.ts', value);
  };

  const preview = (iframe: HTMLIFrameElement, container: WebContainer) => {
    iframe.src =
      'data:text/html;base64,' +
      btoa('<p style="text-align: center"><em>Loading preview...</em></p>');

    container.on('server-ready', (port, url) => {
      iframe.src = `${url}/graphql`;
    });
  };

  const run = (textarea: HTMLTextAreaElement, container: WebContainer) => {
    const createLogStream = () =>
      new WritableStream({
        write(data) {
          textarea.value += stripAnsi(data);
          textarea.scrollTop = textarea.scrollHeight;
        },
      });

    // Run tasks in an unbound context
    (async () => {
      // Install dependencies
      const install = await container.spawn('npm', ['install']);
      install.output.pipeTo(createLogStream());
      if ((await install.exit) !== 0) return;

      // Start the dev server
      const run = await container.spawn('npm', ['run', 'start']);
      run.output.pipeTo(createLogStream());
    })();

    return {};
  };
</script>

{#await createContainer()}
  <div class="loading">
    <h1>Loading...</h1>
  </div>
{:then container}
  <main>
    <textarea bind:value />
    <button on:click={save(container)}>▶️</button>
    <iframe use:preview={container} title="Preview" />
    <textarea readonly use:run={container} style:grid-column="1 / 4" />
  </main>
{:catch error}
  <pre>{error}</pre>
{/await}

<style lang="scss">
  main {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 4fr 1fr;

    > * {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  textarea {
    font-family: monospace;
    resize: none;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>
