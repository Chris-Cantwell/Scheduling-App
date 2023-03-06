<script>
   export let week;
   
   import { createEventDispatcher } from "svelte"; 
   
   let gridList = [
        {value: 1, available: 0},
        {value: 2, available: 0},
        {value: 3, available: 1},
        {value: 4, available: 1},
        {value: 5, available: 0},
        {value: 6, available: 0},
        {value: 7, available: 0},
        {value: 5, available: 0},
        {value: 6, available: 0},
        {value: 7, available: 0},
    ]

</script>

<div class="grid-container">
    {#each gridList as item}
        {#if item.available}
            <div class="grid-item-active" id={item.value} on:click={logClick}>
                {item.value} 
            </div>
        {:else}
            <div class="grid-item-inactive" id={item.value} on:click|self={handleMousedown}>
                {item.value} 
            </div>
        {/if}
    {/each}
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto;
        column-gap: 5px;
        max-width: 40px;
    }

    .grid-item-active {
        background-color: rgba(170, 240, 170, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 20px;
        font-size: 30px;
        text-align: center;
    }

    .grid-item-inactive {
        background-color: rgba(167, 167, 167, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 20px;
        font-size: 30px;
        text-align: center;
    }
</style>