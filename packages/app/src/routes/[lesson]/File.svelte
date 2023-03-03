<script lang="ts">
  export let props: {
    contents: string;
    dirty: boolean;
  };
</script>

<textarea
  bind:value={props.contents}
  on:input={() => {
    props.dirty = true;
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
