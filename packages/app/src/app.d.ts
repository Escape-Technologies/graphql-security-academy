import type { WebContainer } from '@webcontainer/api';
import 'unplugin-icons/types/svelte';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      title?: string;
    }
    // interface Platform {}
  }

  interface Window {
    webcontainer: Promise<WebContainer>;
  }
}
