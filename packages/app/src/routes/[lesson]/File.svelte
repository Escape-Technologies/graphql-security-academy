<script lang="ts">
  export let context: {
    contents: string;
    dirty: boolean;
  };
</script>

<textarea
  bind:value={context.contents}
  on:input={() => {
    context.dirty = true;
  }}
/>

<style lang="scss">
  textarea {
    display: block;
    font-family: monospace;
    resize: none;
    width: 100%;
    height: 100%;
  }
</style>
