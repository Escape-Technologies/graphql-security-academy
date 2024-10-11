<script lang="ts">
  import Slack from '~icons/simple-icons/slack';
  import Github from '~icons/simple-icons/github';
</script>

<p>
  <a href="https://slack.escape.tech" class="slack" target="_blank">
    <Slack /> Join our Slack
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

  .slack {
    color: #4a154b;
    border: 1px solid #4a154b;

    &:hover {
      color: #fff;
      background: #4a154b;
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
