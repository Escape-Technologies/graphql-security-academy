<script lang="ts">
  export let contents: string;
</script>

<textarea bind:value={contents} />

<style lang="scss">
  textarea {
    font-family: monospace;
    resize: none;
  }
</style>
