<script lang="ts">
  import { page } from '$app/stores';
  import '../app.scss';
</script>

<svelte:head>
  <title>
    {$page.data.title ? `${$page.data.title} – ` : ''}Escape Academy (beta)
  </title>
</svelte:head>

<slot />
