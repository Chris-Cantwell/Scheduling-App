<script>
    import { to_number } from 'svelte/internal';
    export let availLst;
    export let timeOffset;
</script>

{#if !availLst.length}None{/if}
{#each availLst as entry, i} 
        {#if i}, {/if}
        {(entry.startHr + to_number(timeOffset)) % 24}:{#if entry.startMin != 0}{entry.startMin}{:else}00{/if} - 
        {(entry.endHr + to_number(timeOffset)) % 24}:{#if entry.endMin != 0}{entry.endMin}{:else}00{/if}
{/each}
