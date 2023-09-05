<script lang="ts">
  import { navigating, page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import logo from '$assets/logo.svg?url';
  import byEscape from '$assets/byEscape.svg?url';
  import Burger from '$lib/layout/nav/Burger.svelte';
  import ListItems from '$lib/layout/nav/ListItems.svelte';

  export let mobile = $page.data.mobile;
  export let menuOpen = false;

  const onResize = () => {
    if (window.matchMedia('(min-width: 992px)').matches) {
      menuOpen = false;
      mobile = false;
    } else {
      mobile = true;
    }
  };

  onMount(onResize);

  $: if ($navigating) menuOpen = false;
</script>

<div class="page-header">
  <header>
    <div class="title">
      <img
        src={logo}
        alt="API Security Academy logo"
        width="60"
        height="auto"
      />
      <div>
        <h1>API Security Academy</h1>
        <img
          src={byEscape}
          alt="API Security Academy by Escape"
          width="80"
          height="auto"
        />
      </div>
    </div>

    {#if mobile}
      <Burger
        on:click={() => {
          menuOpen = !menuOpen;
        }}
      />
    {:else}
      <div class="links">
        <ListItems />
      </div>
    {/if}
  </header>
  {#if mobile && menuOpen}
    <div class="mobile-links" transition:fade={{ duration: 100 }}>
      <ListItems />
    </div>
  {/if}
</div>

<style lang="scss">
  header {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    justify-content: space-between;
    max-width: 1400px;
    padding-inline: 0.5rem;
    margin: 0 auto;
  }

  /* stylelint-disable-next-line media-feature-range-notation */
  @media (min-width: 50rem) {
    header {
      flex-direction: row;
      align-items: center;

      .links {
        display: block;
      }
    }

    .mobile-links {
      display: none;
    }
  }

  h1 {
    margin: 0;
    font-size: 1.4em;
  }

  .page-header {
    padding: 1rem;
    background: var(--main);
    box-shadow: 0 0 0.5rem var(--dark);
  }

  .title {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    > div {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      align-items: flex-end;
    }
  }
</style>
