<script lang="ts">
  import logo from '$assets/logo.svg?url';
  import byEscape from '$assets/byEscape.svg?url';
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
    <div class="links">
      <a href="https://escape.tech">Website </a>
      <a href="https://escape.tech/company/">About Escape </a>
      <a href="https://escape.tech/blog/">Blog </a>
    </div>
  </header>
</div>

<style lang="scss">
  header {
    display: flex;
    flex-flow: column wrap;
    gap: 0.5rem;
    align-items: flex-start;
    justify-content: space-between;
    max-width: 1400px;
    padding-inline: 0.5rem;
    margin: 0 auto;

    .links {
      display: flex;
      gap: 1rem;
      align-items: center;
      align-self: flex-end;
    }

    /* stylelint-disable-next-line media-feature-range-notation */
    @media (min-width: 50rem) {
      flex-direction: row;
      align-items: center;

      .links {
        align-self: inherit;
      }
    }
  }

  h1 {
    margin: 0;
    font-size: 1.4em;
    font-weight: 400;
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

    > div {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
</style>
