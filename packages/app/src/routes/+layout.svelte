<script lang="ts">
  import { page } from '$app/stores';
  import '../app.scss';
</script>

<svelte:head>
  <title>
    {$page.data.title ? `${$page.data.title} – ` : ''}learn.escape.tech
  </title>
</svelte:head>

<slot />
