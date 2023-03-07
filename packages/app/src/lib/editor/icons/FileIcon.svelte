<script lang="ts">
  import type { SvelteComponentTyped } from 'svelte';
  import type { SVGAttributes } from 'svelte/elements';
  import Book from '~icons/ri/book-open-fill';
  import Database from '~icons/ri/database-2-fill';
  import File from '~icons/ri/file-3-fill';
  import Settings from '~icons/ri/settings-5-fill';
  import Html from '~icons/simple-icons/html5';
  import Javascript from '~icons/simple-icons/javascript';
  import Npm from '~icons/simple-icons/npm';
  import Prisma from '~icons/simple-icons/prisma';
  import Toml from '~icons/simple-icons/toml';

  export let name: string;

  const map = [
    { t: 'matches', v: 'package.json', i: Npm, l: true, c: '#cb3837' },
    { t: 'startsWith', v: 'readme', i: Book },
    { t: 'startsWith', v: '.env', i: Settings },
    { t: 'endsWith', v: '.html', i: Html, l: true, c: '#e34f26' },
    { t: 'endsWith', v: '.js', i: Javascript, l: true, c: '#f7df1e' },
    { t: 'endsWith', v: '.sql', i: Database, c: '#d47131' },
    { t: 'endsWith', v: '.toml', i: Toml, l: true, c: '#9c4221' },
    { t: 'endsWith', v: '.prisma', i: Prisma, l: true, c: '#5898b3' },
  ] satisfies Array<{
    t: 'matches' | 'startsWith' | 'endsWith';
    v: string;
    i: new (args: never) => SvelteComponentTyped<SVGAttributes<EventTarget>>;
    l?: boolean;
    c?: string;
  }>;

  const match = (name: string) => {
    for (const { t, v, i: icon, l: logo, c: color } of map) {
      if (
        (t === 'matches' && name === v) ||
        (t === 'startsWith' && name.startsWith(v)) ||
        (t === 'endsWith' && name.endsWith(v))
      ) {
        return { icon, logo, color };
      }
    }
    return { icon: File };
  };

  $: basename = (name.split('/').pop() ?? '').toLowerCase();
  $: ({ icon, logo, color } = match(basename));
</script>

<span class:logo style:color>
  <svelte:component this={icon} />
</span>

<style lang="scss">
  // Logos, unlike icons, have no natural padding
  .logo :global(.icon) {
    padding: 0.125em;
    border-radius: 0.25em;
    fill: currentcolor;
  }
</style>
