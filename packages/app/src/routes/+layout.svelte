<script lang="ts">
  import { page } from '$app/stores';
  import '../app.scss';
</script>

<svelte:head>
  <title>{$page.data.title}</title>
  <meta name="title" property="og:title" content={$page.data.title} />
  <meta
    name="image"
    property="og:image"
    content="https://escape.tech/academy/Escape_academy_logo.jpg"
  />
  <meta property="og:image:alt" content="API Security Academy" />
  <meta
    name="description"
    property="og:description"
    content={$page.data.description}
  />
  <meta property="og:url" content="https://escape.tech/academy/" />
  <meta name="author" content="Escape AppSec Company" />
</svelte:head>

<slot />
