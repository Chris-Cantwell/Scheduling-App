<script>
   import { each } from "svelte/internal";

   export let week;
   let days = week.days;

   const start_time = week.earliest_time.hour * 60 + week.earliest_time.minute;
   const end_time = week.latest_time.hour * 60 + week.latest_time.minute;

   let num_intervals = (end_time - start_time) / week.interval_minutes;

   // import { createEventDispatcher } from "svelte"; 
   
   let gridList = []
    
    let count = 0;

    for(let block = 0; block < num_intervals; block++){
        for(let day = 0; day < days.length; day++){
            gridList.push({
                available: false,
                id: count,

                col: day, 
                day: days[day], 
                
                row: block,

                hour: Math.floor((start_time + (block * week.interval_minutes)) / 60),
                minute: (start_time + (block * week.interval_minutes)) % 60
            });
            count++;
        }
    }
   let draggedCells = []

   function trackDrag(id){
        draggedCells = [draggedCells, gridList[id]]; 
   }

   function toggleAvailability(id) {

        if(!toggleMode){
            gridList[id].available = false;
        } else {
            gridList[id].available = true;
        }

        gridList = gridList; // This refresh is important to get the reactivity to work
   }

    $: selecting = false;
    $: toggleMode = true;

    function handleMouseMove(event){
        if(selecting){
            console.log(event.srcElement.id);
            toggleAvailability(event.srcElement.id);
        }
    }

    function handleMouseDown(event){
        selecting = true;
        toggleAvailability(event.srcElement.id);
    }

    function handleMouseUp(event){
        selecting = false;
        toggleAvailability(event.srcElement.id);
    }

</script>

<p>{draggedCells} </p>
<p>
{#each draggedCells as cell}
    ({cell.value}, {cell.available}) <br>
{/each}
</p>

<div class="grid-container" on:mousemove={handleMouseMove}>
    {#each days as day}
        <div class="grid-item-header">{day}</div>
    {/each}
    {#each gridList as item}
        {#if item.day == ""}
            <div class="grid-item-sidebar" id={item.id}> {item.hour}:{item.minute} </div>
        {:else if item.available}
            <div class="grid-item-active" id={item.id} 
                on:mousedown={handleMouseDown} on:mousedown={()=>toggleMode = false}
                on:mouseup={handleMouseUp}>
            </div>
        {:else}
            <div class="grid-item-inactive" id={item.id} 
                on:mousedown={handleMouseDown} on:mousedown={()=>toggleMode = true}
                on:mouseup={handleMouseUp}>
            </div>
        {/if}
    {/each}
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto auto;
        column-gap: 0px;
    }

    .grid-item-header {
        background-color: rgba(242, 242, 242, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 8px;
        font-size: 20px;
        text-align: center;
    }
    
    .grid-item-sidebar{
        background-color: rgba(242, 242, 242, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 3px;
        font-size: 10px;
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