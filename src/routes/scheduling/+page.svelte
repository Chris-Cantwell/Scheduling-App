<script>
    import { onMount } from 'svelte';
    import { mutationStore } from '@urql/svelte';
    import Table from './Table.svelte';
    import { user, client } from "../stores"
    import { TIME_SPENT, ADD_AVAIL } from "./graphql";
    import { goto } from '$app/navigation';

    onMount(() => {
        if (!$user || !$user.id) {
        goto('/');
    }});

    user.subscribe(d => {
        if (!d) {
            goto("/")
        }
    })

    let result;
    let timeResult;
    let startTime = new Date();
    let availability = $user?.availability || {};

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

    const captureAvailability = async () => {
        result = mutationStore({
            client,
            query: ADD_AVAIL,
            variables: { 
                userId: $user?.id, 
                input: availability,
                zoomInput: availability, // PLACEHOLDER FOR VIRTUAL
            },
        });

        result.subscribe(d => {
            if (d && (d.data || d.error)) {
                user.set(null)
            }
        })
    };

    const handleSubmit = async () => {
        captureTimeSpent() 
        captureAvailability()
    }

    let week = {
        // Add a blank precursor day to hold time block labels
        days: ["", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        earliest_time: {hour: 8, minute: 0}, // Time code, 24h hh:mm
        latest_time: {hour: 18, minute: 0}, // Time code, 24h hh:mm
        interval_minutes: 30 // Interval in Minutes
    }

    let timeOffset = 0;

</script>

<center>
    <h2 class="title"> Please Indicate Your In-Person Availability </h2>
    <h4 class="body"> Click & Drag to Highlight Available Blocks (Hosted in EST)</h4>
    

    <label class="timezone" for="offset">Select Timezone</label>
    <select name="offset" id="offset" bind:value={timeOffset}>
        <option value=-5>Hawaii -5</option>
        <option value=-4>Alaska -4</option>
        <option value=-3>Pacific Time -3</option>
        <option value=-2>Mountain Time -2</option>
        <option value=-1>Central Time -1</option>
        <option value=0 selected>Eastern Standard Time +0</option>
        <option value=1>Atlantic Time +1</option>
        <option value=2>Greenland; Buenos Aires +2</option>
        <option value=4>Cape Verde +4</option>
        <option value=5>GMT/UTC +5</option>
        <option value=6>Central European Time +6</option>
        <option value=7>Eastern European Time +7</option>
        <option value=8>Arabia Standard Time +8</option>
        <option value=13>China Standard Time +13</option>
    </select>
    
    
    <form on:submit|preventDefault="{handleSubmit}">
        <button>Submit</button>
    </form>
</center>
<Table week={week} bind:availability={availability} bind:timeOffset={timeOffset}/> 

<style>
    .title {
        margin-top: 20px;
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
        margin-bottom: 15px;
        color: #444B59;
    }
    .timezone {
        font-family: 'Nunito';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        letter-spacing: 0.1em;
        color: #444B59;
    }
    button {
        display: inline-block;
        width: 100px;
        height: 30px;
        background: #E25661;
        box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.094);        
        border-radius: 10px;
        border-color: transparent;
        margin-bottom: 15px;
        margin-top: 15px;
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