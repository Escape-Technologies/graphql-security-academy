<script lang="ts">
  import Discord from '~icons/simple-icons/discord';
  import Github from '~icons/simple-icons/github';
</script>

<p>
  <a
    href="https://github.com/Escape-Technologies/graphql-security-academy"
    class="github"
    target="_blank"
  >
    <Github /> Star on GitHub
  </a>
  <a href="https://discord.escape.tech" class="discord" target="_blank">
    <Discord /> Join Escape Community
  </a>
</p>

<style lang="scss">
  p {
    display: flex;
    gap: 1em;
    justify-content: center;
  }

  a {
    display: flex;
    gap: 0.5em;
    padding: 0.5em;
    color: #fff;
    text-decoration: none;
    border-radius: 0.5em;
    transition: box-shadow 0.1s ease-out;
  }

  .discord {
    background: #5865f2;

    &:hover {
      box-shadow: 0 0 1em #5865f280;
    }
  }

  .github {
    background: #1f2328;

    &:hover {
      box-shadow: 0 0 1em #1f232880;
    }
  }
</style>
