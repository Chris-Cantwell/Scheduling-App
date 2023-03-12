<script>
    import { mutationStore } from '@urql/svelte';
    import Table from './Table.svelte';
    import { user, client } from '../stores';
    import { TIME_SPENT, ADD_AVAIL } from "./graphql";
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { TIMEZONES } from './constants.js';

    // # Routing
    user.subscribe(d => {
        if (!d || !d.id) {
            if (browser) {
                goto("/")
            }    
        }
    })

    let result;
    let timeResult;
    let startTime = new Date();
    let availability = $user?.availability || {};

    // For user testing: timing each user
    const captureTimeSpent = async () => {
        timeResult = mutationStore({
            client,
            query: TIME_SPENT,
            variables: { 
                userId: $user?.id, 
                timeSpentSeconds: Math.abs(startTime.getTime() - (new Date()).getTime())/1000,
                startTime, 
                endTime: new Date(),
            },
        });
    };

    // # Persistent Storage
    // Save availability to DB
    const captureAvailability = async () => {
        result = mutationStore({
            client,
            query: ADD_AVAIL,
            variables: { 
                userId: $user?.id, 
                input: availability,
            },
        });

        result.subscribe(d => {
            if (d && (d.data || d.error)) {
                user.set(null);
            }
        })
    };

    const handleSubmit = async () => {
        captureTimeSpent();
        captureAvailability();
    }

    // # Time Blocks
    let week = {
        // Add a blank precursor day to hold time block labels
        days: ["", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        earliest_time: {hour: 8, minute: 0}, // Time code, 24h hh:mm
        latest_time: {hour: 18, minute: 0}, // Time code, 24h hh:mm
        interval_minutes: 30 // Interval in Minutes
    }

    let timeOffset = 0;
    let selectValue;
    let modality;
</script>

<center>
    <h2 class="title">Please Highlight Your Availability</h2>
    <h4 class="body">Event hosted in EST</h4>
</center>
<div class="aboveTable">
    <div class="selectors">
        <div>
            <label class="selectLabel" for="offset">Time Zone</label>
            <select name="offset" id="offset" bind:value={selectValue} on:change="{() => timeOffset = selectValue}">
                {#each TIMEZONES as zone} 
                <option value={zone.value} selected={zone.selected}>{zone.display}</option>
                {/each}
            </select>
        </div>
        <div>
            <label class="selectLabel" for="modality">Modality</label>
            <select name="modality" id="modality" bind:value={modality}>
                <option value={false} selected>In person</option>
                <option value={true}>Virtual only</option>
            </select>
        </div>
    </div>
    <form on:submit|preventDefault="{handleSubmit}">
        <button>Submit</button>
    </form>
</div>
<!-- Table component written from a concept perspective to be re-usable -->
<Table 
    week={week} 
    bind:availability={availability} 
    bind:timeOffset={timeOffset}
    bind:modality={modality}
/> 

<style>
    select {
        border: 1px solid #E25661;
        font-family: 'Nunito';
        font-size: 14px;
        letter-spacing: 0.1em;
        box-shadow: 2px 2px 4px 1px rgba(210, 151, 151, 0.236); 
        border-radius: 5px;
        padding-left: 3px;
        margin-bottom: 5px;
    }
    .selectors {
        display: flex;
        flex-direction: column;
    }
    .aboveTable {
        margin-right: 15vw;
        margin-left: 15vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 10px;
    }
    @media (max-width: 1000px) {
        .aboveTable {
            margin-left: 5vw;
            margin-right: 5vw;
        }
    }
    .title {
        margin-top: 40px;
        max-width: 700px;
        font-family: 'Overpass';
        font-style: normal;
        font-weight: 800;
        font-size: 30px;
        letter-spacing: 0.05em;
        color: #444B59;
        background-color: #FBFCFF;
    }
    .body {
        font-family: 'Nunito';
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        letter-spacing: 0.1em;
        margin-bottom: 35px;
        color: #444B59;
    }
    .selectLabel {
        font-family: 'Nunito';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        letter-spacing: 0.1em;
        color: #444B59;
        min-width: 80px;
    }
    button {
        display: inline-block;
        width: 100px;
        height: 30px;
        background: #E25661;
        box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.094);        
        border-radius: 10px;
        border-color: transparent;
        font-family: 'Nunito';
        font-style: normal;
        font-weight: 800;
        font-size: 12px;
        text-align: center;
        letter-spacing: 0.1em;
        color: #FFFFFF;
    }
    button:disabled,
    button[disabled] {
        opacity: 0.5;
    }
    button:hover:enabled {
        transform: scale(1.02) perspective(1px);
        transition-duration: 0.4s;
        -webkit-transition-duration: 0.4s;
        -ms-transition-duration: 0.4s;
        -moz-transition-duration: 0.4s;
    }
</style>