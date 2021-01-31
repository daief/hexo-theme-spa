import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export function useIsMounted() {
  const isMounted = writable(false);

  onMount(() => {
    isMounted.set(true);
  });

  return isMounted;
}
