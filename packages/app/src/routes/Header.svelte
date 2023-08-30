<script lang="ts">
  import logo from '$assets/logo.svg?url';
  import RiShareBoxFill from '~icons/ri/share-box-fill';
</script>

<div class="page-header">
  <header>
    <div class="title">
      <img src={logo} alt="" />
      <h1>GraphQL Security Academy</h1>
      <span class="beta">Beta</span>
    </div>
    <div class="links">
      <a href="https//escape.tech">Website <RiShareBoxFill /></a>
      <a href="https//escape.tech/company/">About Escape <RiShareBoxFill /></a>
      <a href="https//escape.tech/blog/">Blog <RiShareBoxFill /></a>
    </div>
  </header>
</div>

<style lang="scss">
  header {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
    padding-inline: 0.5rem;
    margin: 0 auto;
  }

  h1 {
    margin: 0;
  }

  a {
    text-decoration: none;

    > :global(svg) {
      width: 1em;
    }
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
  }

  .links {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .beta {
    padding: 0 0.25em;
    font-family: 'Inter', sans-serif;
    font-size: 0.8em;
    font-weight: bold;
    color: #fff;
    vertical-align: middle;
    background: #07c9ac;
    border-radius: 0.25em;
  }
</style>
