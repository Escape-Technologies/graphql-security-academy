<div>
  <span class="icon">👋</span>
  <h1>Hello World!</h1>
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    user-select: text;
  }

  .icon {
    font-size: 5em;
    line-height: 1;
    transform-origin: bottom right;

    &:hover {
      animation: wave 0.5s linear infinite;
    }
  }

  @keyframes wave {
    0%,
    50%,
    100% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(10deg);
    }

    75% {
      transform: rotate(-10deg);
    }
  }
</style>
