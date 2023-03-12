import { writable } from 'svelte/store';
import { createClient } from '@urql/svelte';

// Track logged in user
export const user = writable(null);

// Client for queries/mutations
export const client = createClient({
    url: 'http://localhost:5001/graphql',
});