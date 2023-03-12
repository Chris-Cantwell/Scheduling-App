<script>
    import { to_number } from 'svelte/internal';
    import { writable } from 'svelte/store';
    import SummaryList from './SummaryList.svelte';
    import { compareTimes } from './constants';

    // Handle props, set important vars for component 
    export let week;
    export let timeOffset;
    export let availability;
    export let modality;
    let days = week.days;

    const start_time = week.earliest_time.hour * 60 + week.earliest_time.minute;
    const end_time = week.latest_time.hour * 60 + week.latest_time.minute;

    let num_intervals = (end_time - start_time) / week.interval_minutes;
    let gridList = []
    let count = 0;

    // # Time Block
    // Initialize Blocks
    for (let block = 0; block <= num_intervals; block++) {
        for (let day = 0; day < days.length; day++) {
            const dayAvailability = availability[days[day]];
            const hr = Math.floor((start_time + (block * week.interval_minutes)) / 60);
            const min = (start_time + (block * week.interval_minutes)) % 60;
            const blockObj = dayAvailability && dayAvailability.find(d => compareTimes(hr, min, d.startHr, d.startMin, d.endHr, d.endMin));
            gridList.push({
                available: !!blockObj,
                id: count,
                col: day, 
                day: days[day],  
                row: block,
                hr,
                min, 
                virtual: blockObj && blockObj.virtual,
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

    function handleMouseUp(event) {
        selecting = false;
        toggleAvailability(event.srcElement.id);
        calculateAvailability();
    }
    
    // # Time Blocks -- Preferences > Binary Availability 
    function toggleAvailability(id) {
        gridList[id].available = !!toggleMode;
        gridList[id].virtual = !!modality;
        gridList = gridList;
    }

    function handleMouseMove(event){
        if (selecting) {
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
        let currentDay = "";
        let writing_block = false;
        let virtual_block = false;

        for(let day = 1; day < days.length; day++){
            count = day;
            let startHr = 0; 
            let startMin = 0;
            let endHr = 0; 
            let endMin = 0;

            for(let block = 0; block <= num_intervals; block++){
                const { available: isAvail, hr, min, virtual: isVirtual } = gridList[count]
                const isEnd = block == num_intervals;
                if (isAvail) {
                    currentDay = gridList[count].day;
                    const diffModality = writing_block && isVirtual != virtual_block
                    if (!writing_block || diffModality) {
                        // Start new block; save previous
                        if (diffModality) {
                            availList[currentDay].push({
                                startHr, startMin, endHr, endMin, virtual: virtual_block,
                            }); 
                        } 
                        virtual_block = isVirtual;
                        writing_block = true; 
                        startHr = hr;
                        startMin = min;
                    }
                    // Update potential end
                    endHr = hr + (min == 30 ? 1 : 0);
                    endMin = (min + 30) % 60;
                }
                if ((isAvail && isEnd) || (!isAvail && writing_block)) {
                    // End current block
                    availList[currentDay].push({
                        startHr, startMin, endHr, endMin, virtual: virtual_block,
                    });
                    writing_block = false; 
                    virtual_block = false; 
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
    <!-- # Each "item" is a time block -->
    {#each gridList as item}
        {#if item.day == ""}
            <div class="grid-item-sidebar" id={item.id} draggable="false"> 
                {(item.hr + to_number(timeOffset)) % 24}:{#if item.min != 0}{item.min}{:else}00{/if} 
            </div>
        {:else if item.available}
            <div class={`grid-item grid-item-active ${item.virtual ? 'virtual' : ''}`} id={item.id} 
                on:mousedown={handleMouseDown} on:mousedown={()=>toggleMode = false}
                on:mouseup={handleMouseUp}>
            </div>
        {:else}
            <div class="grid-item grid-item-inactive" id={item.id} 
                on:mousedown={handleMouseDown} on:mousedown={()=>toggleMode = true}
                on:mouseup={handleMouseUp}> 
            </div>
        {/if}
    {/each}
</div>
<p class="labelTitle">Availability Summary:</p>
<div>
{#each Object.keys($availabilityList).filter(d => days.includes(d)) as label} 
    <p class="label it">{label}:</p>
    <div class="times">
        <p class="body">
            In Person:
            <SummaryList 
                availLst={$availabilityList[label].filter(d => !d.virtual)} 
                timeOffset={timeOffset}
            />
        </p>
        <p class="body">
            Virtual only:
            <SummaryList 
                availLst={$availabilityList[label].filter(d => d.virtual)} 
                timeOffset={timeOffset}
            />
        </p>
    </div>
{/each}
</div>
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto auto;
        column-gap: 0px;
        margin-bottom: 30px;
        box-shadow: 3px 4px 10px 5px rgba(127, 105, 105, 0.164);
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
    }
    .grid-item-header {
        background-color: #E25661;
        border-bottom: 0.5px solid #e66973;
        padding: 5px;
        font-size: 14px;
        text-align: center;
        text-transform: capitalize;
        color: #FFFFFF;
        font-family: 'Nunito';
    }
    .grid-item-header:first-child {
        border-top-left-radius: 20px;
    }
    .grid-item-header:nth-child(8) {
        border-top-right-radius: 20px;
    } 
    .grid-item-sidebar {
        background-color: #f0f0f0b9;
        border: 0.5px solid #e66973;
        padding: 3px;
        font-size: 12px;
        text-align: center;
        font-family: 'Nunito';
        color: #444B59;
    }
    .grid-item {
        padding: 5px;
        font-size: 10px;
        text-align: center;
        border: 0.5px solid #e66973;
    }
    .grid-item.grid-item-active {
        background-color: #77e3b8;
        border: 0.5px solid #a7f5de6a;
    }
    .grid-item.grid-item-active.virtual {
        background-color: #77cde3;
        border: 0.5px solid #69e0e698;
    }

    .grid-item.grid-item-inactive {
        background-color: #f0f0f0b9;
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
        margin-right: 15vw;
        margin-left: 15vw;
    }
    @media (max-width: 1000px) {
        .main {
            margin-left: 5vw;
            margin-right: 5vw;
        }
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
    .times {
        margin-left: 40px;
    }
    .label.it {
        font-style: italic;
    }
</style>