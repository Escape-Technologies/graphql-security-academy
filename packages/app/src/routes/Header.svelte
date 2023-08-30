<script lang="ts">
  import logo from '$assets/logo.svg?url';
</script>

<div class="page-header">
  <header>
    <img src={logo} alt="" />
    <h1>GraphQL Security Academy</h1>
    <span class="beta">Beta</span>
    <div style="flex: 1" />
  </header>
</div>

<style lang="scss">
  header {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    max-width: 50rem;
    padding-inline: 1rem;
    margin: 0 auto;

    > * {
      text-align: center;
    }
  }

  h1 {
    margin: 0;
  }

  .page-header {
    padding: 1rem;
    background: var(--main);
    box-shadow: 0 0 0.5rem var(--dark);
  }

  .beta {
    padding: 0 0.25em;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.8em;
    font-weight: bold;
    color: #fff;
    vertical-align: middle;
    background: #07c9ac;
    border-radius: 0.25em;
  }
</style>
