<script>
   export let week;
   let days = week.days;

   let num_intervals = (
    ((week.latest_time.hour * 60 + week.latest_time.minute) - 
    (week.earliest_time.hour * 60 + week.earliest_time.minute)) / week.interval_min);

   // import { createEventDispatcher } from "svelte"; 
   
   let gridList = []

   for(let i = 0; i < (num_intervals * 7); i++){
        gridList.push({
            value: i,
            available: false
        });
   }

   function logClick(event) {
        console.log("Mouse Movin'")
   }

</script>

<div class="grid-container">
    {#each days as day}
        <div class="grid-item-header">{day}</div>
    {/each}
    {#each gridList as item}
        {#if item.available}
            <div class="grid-item-active" id={item.value} on:mouseenter={logClick}>
                {item.value} 
            </div>
        {:else}
            <div class="grid-item-inactive" id={item.value} on:mouseleave={logClick}>
                {item.value} 
            </div>
        {/if}
    {/each}
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto;
        column-gap: 0px;
    }

    .grid-item-header {
        background-color: rgba(242, 242, 242, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 8px;
        font-size: 20px;
        text-align: center;
    }

    .grid-item-active {
        background-color: rgba(170, 240, 170, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 5px;
        font-size: 10px;
        text-align: center;
    }

    .grid-item-inactive {
        background-color: rgba(167, 167, 167, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 5px;
        font-size: 10px;
        text-align: center;
    }
</style>