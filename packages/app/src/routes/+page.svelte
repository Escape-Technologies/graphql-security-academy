<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Learn GraphQL Security / APIDevSec.com / Whatever</h1>

<p>Choose a lesson:</p>

<ul>
  {#each data.lessons as { path, title }}
    <li><a href={path}>{title}</a></li>
  {/each}
</ul>
