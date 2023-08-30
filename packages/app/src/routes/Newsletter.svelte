<script lang="ts">
  import { slide } from 'svelte/transition';

  let state: 'loading' | 'success' | 'error' | undefined;
  const submit = async (form: HTMLFormElement) => {
    state = 'loading';
    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (!response.ok)
        throw new Error(`Received ${response.status} ${response.statusText}`);

      state = 'success';
      form.reset();
    } catch (error) {
      console.error(error);
      state = 'error';
    }
  };
</script>

<div>
  <form
    on:submit|preventDefault={({ currentTarget }) => submit(currentTarget)}
    action="https://formspree.io/f/mpzgrape"
    method="POST"
  >
    <label>
      Want to get notified of new lessons? Enter your email address:
      <input
        type="email"
        name="email"
        required
        disabled={state === 'loading'}
      />
    </label>
    <button disabled={state === 'loading'}>Submit</button>
  </form>
  {#if state === 'success'}
    <p style="text-align: center" transition:slide>
      Thank you for subscribing!
    </p>
  {:else if state === 'error'}
    <p style="text-align: center" transition:slide>
      Something went wrong. Please try again later.
    </p>
  {/if}
</div>

<style lang="scss">
  div {
    margin-block: 1rem;
  }

  form {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }

  label {
    display: flex;
    flex-direction: column;
  }
</style>
