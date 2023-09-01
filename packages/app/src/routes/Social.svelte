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
    font-size: 0.9em;
    color: #fff;
    text-decoration: none;
    border-radius: 0.25em;
    transition: box-shadow 0.1s ease-out;
  }

  .discord {
    color: #5865f2;
    border: 1px solid #5865f2;

    &:hover {
      color: #fff;
      background: #5865f2;
    }
  }

  .github {
    color: #1f2328;
    border: 1px solid #1f2328;

    &:hover {
      color: #fff;
      background: #1f2328;
    }
  }
</style>
