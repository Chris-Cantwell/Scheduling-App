<script>
    import { to_number } from 'svelte/internal';
   import { writable } from 'svelte/store';
   
   // Handle props, set important vars for component 
   export let week;
   export let timeOffset;
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
            const dayAvailability = availability[days[day]];
            const hour = Math.floor((start_time + (block * week.interval_minutes)) / 60);
            const minute = (start_time + (block * week.interval_minutes)) % 60;
            const t = `${hour}:${minute}`
            gridList.push({
                available: dayAvailability && dayAvailability.find(d => `${d.startHr}:${d.startMin}` <= t &&  t < `${d.endHr}:${d.endMin}`),
                id: count,
                col: day, 
                day: days[day],  
                row: block,
                hour,
                minute, 
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
    const availabilityList = writable(availability)

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
<div class="main">
<div class="grid-container prevent-select" on:mousemove={handleMouseMove} 
    ondragstart="return false;" ondrop="return false;" draggable="false">

    {#each days as day}
        <div class="grid-item-header" draggable="false">{day}</div>
    {/each}
    {#each gridList as item}
        {#if item.day == ""}
            <div class="grid-item-sidebar" id={item.id} draggable="false"> 
                {(item.hour + to_number(timeOffset)) % 24}:{#if item.minute != 0}{item.minute}{:else}00{/if} </div>
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


<p class="labelTitle">Your Availability: (With Offset {timeOffset})</p>
<p class="body">
{#each Object.keys($availabilityList).filter(d => days.includes(d)) as label} 
    <p class="label it">{label}:</p>
    <p class="body">
        {#each $availabilityList[label] as entry, i} 
            {#if i}, {/if}
            {(entry.startHr + to_number(timeOffset)) % 24}:{#if entry.startMin != 0}{entry.startMin}{:else}00{/if} - 
            {(entry.endHr + to_number(timeOffset)) % 24}:{#if entry.endMin != 0}{entry.endMin}{:else}00{/if}
        {/each}
    </p>
{/each}
</p>
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto auto;
        column-gap: 0px;
        margin-bottom: 30px;
    }

    .grid-item-header {
        background-color: #E25661;
        border: 1px solid #444B59;
        padding: 5px;
        font-size: 14px;
        text-align: center;
        text-transform: capitalize;
        color: #FFFFFF;
        font-family: 'Nunito';
    }
    
    .grid-item-sidebar{
        background-color: #f0f0f0b9;
        border: 1px solid #444B59;
        padding: 3px;
        font-size: 12px;
        text-align: center;
        font-family: 'Nunito';
        color: #444B59;
    }

    .grid-item-active {
        background-color: #E3778B;
        border: 1px solid #444b5941;
        padding: 5px;
        font-size: 10px;
        text-align: center;
    }

    .grid-item-inactive {
        background-color: #f0f0f0b9;
        border: 1px solid #444B59;
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
        color: #444B59;
    }
    .main {
        margin-right: 40px;
        margin-left: 40px;
    }
    .labelTitle { 
        font-family: 'Nunito';
        text-decoration: underline;
        margin-bottom: 10px;
        color: #444B59;
        font-size: 20px;
    }
    .body {
        font-family: 'Nunito';
        color: #444B59;
        font-size: 14px;
    }
    .label.it {
        font-style: italic;
    }
</style>