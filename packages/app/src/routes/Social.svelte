<script lang="ts">
  import Discord from '~icons/simple-icons/discord';
  import Github from '~icons/simple-icons/github';
</script>

<p>
  <a href="https://discord.escape.tech" class="discord" target="_blank">
    <Discord /> Join Community
  </a>
  <a
    href="https://github.com/Escape-Technologies/graphql-security-academy"
    class="github"
    target="_blank"
  >
    <Github /> Star on GitHub
  </a>
</p>

<style lang="scss">
  p {
    display: flex;
    gap: 1em;
    justify-content: flex-end;
  }

  a {
    display: flex;
    gap: 0.5em;
    padding: 0.5em;
    color: #fff;
    text-decoration: none;
    border-radius: 0.25em;
    font-size: 0.9em;
    transition: box-shadow 0.1s ease-out;
  }

  .discord {
    border: 1px solid #5865f2;
    color: #5865f2;

    &:hover {
      background: #5865f2;
      color: #fff;
      // box-shadow: 0 0 1em #bfc4fa80;
    }
  }

  .github {
    border: 1px solid #1f2328;
    color: #1f2328;
    // background: #1f2328;

    &:hover {
      background: #1f2328;
      color: #fff;
      // box-shadow: 0 0 1em #1f23284d;
    }
  }
</style>
