import { writable } from 'svelte/store';
import { createClient } from '@urql/svelte';

export const user = writable(null);

export const client = createClient({
    url: 'http://localhost:5001/graphql',
});