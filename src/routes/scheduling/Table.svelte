<script>
   import { each } from "svelte/internal";
   
   // Handle props, set important vars for component 
   export let week;
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
    $: availabilityList = {
        Monday: [],
        Tuesday: [],
        Wednesday: [], 
        Thursday: [], 
        Friday: [],
        Saturday: [], 
        Sunday: []
    }

    function calculateAvailability(){
        console.log("Calculating")
        
        availabilityList = {
            Monday: [],
            Tuesday: [],
            Wednesday: [], 
            Thursday: [], 
            Friday: [],
            Saturday: [], 
            Sunday: []
        }
        
        // Start at day = 1 and count = num_intervals to skip header row 
        let count = 0;
        
        let start_hr = 0; 
        let start_min = 0;
        let end_hr = 0; 
        let end_min = 0;

        let currentDay = "";
        let writing_block = false;

        
        for(let day = 1; day < days.length; day++){
            count = day;
            console.log(days[day]);

            for(let block = 0; block <= num_intervals; block++){
                console.log(count);
                console.log(gridList[count].available);

                if(!(gridList[count].available) && !writing_block){
                    // Part of unbroken unavailability block -- Do nothing

                } else if(gridList[count].available && writing_block){
                    // Part of unbroken availability block -- Update potential end
                    end_hr = gridList[count].hour;
                    end_min = gridList[count].minute;
                    currentDay = gridList[count].day;
                    console.log("Unbroken Availability")

                } else if (gridList[count].available && !writing_block) {
                    // Start new block
                    writing_block = true; 
                    currentDay = gridList[count].day;
                    
                    start_hr = gridList[count].hour;
                    start_min = gridList[count].minute;
                    console.log("Start New Block")

                } else {
                    // End current block and reset
                    console.log("End Current Block")
                    
                    let newBlock = {start_hr: start_hr, start_min: start_min, 
                                    end_hr: end_hr, end_min: end_min}
                    console.log(newBlock);
                    
                    if(currentDay == "Monday"){
                        console.log(availabilityList.Monday);
                        availabilityList.Monday.push(newBlock);
                        
                    } else if(currentDay == "Tuesday"){
                        console.log(availabilityList.Tuesday);
                        availabilityList.Tuesday.push(newBlock);

                    } else if(currentDay == "Wednesday"){
                        console.log(availabilityList.Wednesday);
                        availabilityList.Wednesday.push(newBlock);

                    } else if(currentDay == "Thursday"){
                        console.log(availabilityList.Thursday);
                        availabilityList.Thursday.push(newBlock);

                    } else if(currentDay == "Friday"){
                        console.log(availabilityList.Friday);
                        availabilityList.Friday.push(newBlock);

                    } else if(currentDay == "Saturday"){
                        console.log(availabilityList.Saturday);
                        availabilityList.Saturday.push(newBlock);

                    }else if(currentDay == "Sunday"){
                        console.log(availabilityList.Sunday);
                        availabilityList.Sunday.push(newBlock);
                    }
                   
                    writing_block = false; 
                }
                
                count+= 8;
            }
        }
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
Monday:
{#each availabilityList.Monday as entry} 
    {entry.start_hr}:{#if entry.start_min != 0}{entry.start_min}{:else}00{/if} - 
    {entry.end_hr}:{#if entry.end_min != 0}{entry.end_min}{:else}00{/if}, 
{/each}
Tuesday: 
{#each availabilityList.Tuesday as entry} 
    {entry.start_hr}:{#if entry.start_min != 0}{entry.start_min}{:else}00{/if} - 
    {entry.end_hr}:{#if entry.end_min != 0}{entry.end_min}{:else}00{/if}, 
{/each}
Wednesday: 
{#each availabilityList.Wednesday as entry} 
    {entry.start_hr}:{#if entry.start_min != 0}{entry.start_min}{:else}00{/if} - 
    {entry.end_hr}:{#if entry.end_min != 0}{entry.end_min}{:else}00{/if}, 
{/each}
Thursday: 
{#each availabilityList.Thursday as entry} 
    {entry.start_hr}:{#if entry.start_min != 0}{entry.start_min}{:else}00{/if} - 
    {entry.end_hr}:{#if entry.end_min != 0}{entry.end_min}{:else}00{/if}, 
{/each}
Friday: 
{#each availabilityList.Friday as entry} 
    {entry.start_hr}:{#if entry.start_min != 0}{entry.start_min}{:else}00{/if} - 
    {entry.end_hr}:{#if entry.end_min != 0}{entry.end_min}{:else}00{/if}, 
{/each}
Saturday: 
{#each availabilityList.Saturday as entry} 
    {entry.start_hr}:{#if entry.start_min != 0}{entry.start_min}{:else}00{/if} - 
    {entry.end_hr}:{#if entry.end_min != 0}{entry.end_min}{:else}00{/if}, 
{/each}
Sunday: {#each availabilityList.Sunday as entry} 
    {entry.start_hr}:{#if entry.start_min != 0}{entry.start_min}{:else}00{/if} - 
    {entry.end_hr}:{#if entry.end_min != 0}{entry.end_min}{:else}00{/if}, 
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
</style>