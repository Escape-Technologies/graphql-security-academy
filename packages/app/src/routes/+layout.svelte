<script lang="ts">
  import { page } from '$app/stores';
  import '../app.scss';
</script>

<svelte:head>
  <title>{$page.data.title}</title>
  <meta name="description" content={$page.data.description} />
  <meta
    name="title"
    property="og:title"
    content="API Security Academy – Master GraphQL API vulnerabilities"
  />
  <meta
    name="image"
    property="og:image"
    content="https://escape.tech/academy/Escape_academy_logo.jpg"
  />
  <meta
    name="image"
    property="og:image:alt"
    content="API Security Academy"
  />
  <meta
    name="description"
    property="og:description"
    content="The API Security Academy is a set of free and interactive online modules that will teach you how to secure your GraphQL applications."
  />
  <meta property="og:url" content="https://escape.tech/academy/" />
  <meta name="author" content="Escape AppSec Company" />
</svelte:head>

<slot />
