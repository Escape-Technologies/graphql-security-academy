<script lang="ts">
  import { page } from '$app/stores';
  import '../app.scss';
</script>

<svelte:head>
  <title>{$page.data.title}</title>
  <meta name="description" content={$page.data.description} />
</svelte:head>

<slot />
