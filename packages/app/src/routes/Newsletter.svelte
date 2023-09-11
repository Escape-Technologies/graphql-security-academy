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
  <h3>Want to get notified about new lessons?</h3>
  <form
    on:submit|preventDefault={({ currentTarget }) => submit(currentTarget)}
    action="https://formspree.io/f/mpzgrape"
    method="POST"
  >
    <label>
      <input
        type="email"
        name="email"
        required
        disabled={state === 'loading'}
        placeholder=" Enter your email address"
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

  h3 {
    margin-block-start: 0;
    margin-block-end: 0.25rem;
  }

  form {
    display: flex;
    gap: 0.25rem;
    align-items: flex-end;
  }

  label {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  button {
    padding: 0.375rem 0.5rem;
  }
</style>
