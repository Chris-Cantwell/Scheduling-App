<script>
   import { writable } from 'svelte/store';
   
   // Handle props, set important vars for component 
   export let week;
   export let availability;
   let days = week.days;

   const start_time = week.earliest_time.hour * 60 + week.earliest_time.minute;
   const end_time = week.latest_time.hour * 60 + week.latest_time.minute;

   let num_intervals = (end_time - start_time) / week.interval_minutes;
   
   let gridList = []
    
   let count = 0;

    // Initialize Blocks

    for(let block = 0; block <= num_intervals; block++){
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

    // Interaction and Cell Updates
    $: selecting = false;
    $: toggleMode = true;

    function handleMouseDown(event){
        selecting = true;
        toggleAvailability(event.srcElement.id);
    }

    function handleMouseUp(event){
        selecting = false;
        toggleAvailability(event.srcElement.id);
        calculateAvailability();
    }
    
    function toggleAvailability(id) {

        if(!toggleMode){
            gridList[id].available = false;
        } else {
            gridList[id].available = true;
        }

        gridList = gridList; // This refresh is important to get the reactivity to work
    }

    function handleMouseMove(event){
        if(selecting){
            toggleAvailability(event.srcElement.id);
        }
    }

    // Store and Save Availability
    const availabilityList = writable({
        monday: [],
        tuesday: [],
        wednesday: [], 
        thursday: [], 
        friday: [],
        saturday: [], 
        sunday: []
    })

    availabilityList.subscribe(data => {
        availability = data;
    });

    function calculateAvailability() {
        let availList = {
            monday: [],
            tuesday: [],
            wednesday: [], 
            thursday: [], 
            friday: [],
            saturday: [], 
            sunday: []
        };
            
        // Start at day = 1 and count = num_intervals to skip header row 
        let count = 0;
        
        let startHr = 0; 
        let startMin = 0;
        let endHr = 0; 
        let endMin = 0;

        let currentDay = "";
        let writing_block = false;

        for(let day = 1; day < days.length; day++){
            count = day;

            for(let block = 0; block <= num_intervals; block++){
                if(!(gridList[count].available) && !writing_block){
                    // Part of unbroken unavailability block -- Do nothing

                } else if(gridList[count].available && writing_block){
                    // Part of unbroken availability block -- Update potential end
                    endHr = gridList[count].hour;
                    endMin = gridList[count].minute + 30;
                    if (endMin == 60) {
                        endHr += 1;
                        endMin = 0;
                    }
                    currentDay = gridList[count].day;

                } else if (gridList[count].available && !writing_block) {
                    // Start new block
                    writing_block = true; 
                    currentDay = gridList[count].day;
                    
                    startHr = gridList[count].hour;
                    startMin = gridList[count].minute;
                    endHr = startHr;
                    endMin = startMin + 30;
                    if (endMin == 60) {
                        endHr += 1;
                        endMin = 0;
                    }

                } else {
                    // End current block and reset
                    let newBlock = {startHr: startHr, startMin: startMin, 
                                    endHr: endHr, endMin: endMin}

                    availList[currentDay].push(newBlock);
                    writing_block = false; 
                }
                count += 8;
            }
        }

        availabilityList.set(availList);
    }

</script>

<div class="grid-container prevent-select" on:mousemove={handleMouseMove} 
    ondragstart="return false;" ondrop="return false;" draggable="false">

    {#each days as day}
        <div class="grid-item-header" draggable="false">{day}</div>
    {/each}
    {#each gridList as item}
        {#if item.day == ""}
            <div class="grid-item-sidebar" id={item.id} draggable="false"> 
                {item.hour}:{#if item.minute != 0}{item.minute}{:else}00{/if} </div>
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

<p>
<b>Your Availability: </b>
{#each Object.keys($availabilityList) as label} 
    <p class="label">{label}:</p>
    {#each $availabilityList[label] as entry} 
    {entry.startHr}:{#if entry.startMin != 0}{entry.startMin}{:else}00{/if} - 
    {entry.endHr}:{#if entry.endMin != 0}{entry.endMin}{:else}00{/if}, 
    {/each}
{/each}
</p>

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
        text-transform: capitalize;
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

    /* https://www.w3schools.com/howto/howto_css_disable_text_selection.asp */
    .prevent-select {
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }

    .label {
        font-family: 'Nunito';
        text-transform: capitalize;
    }
</style>