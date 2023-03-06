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
            if (d && d.data) {
                if (d.data) {
                    console.log('success');
                }
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

</script>

<center>
    <h2> Please Indicate Your In-Person Availability </h2>
    <h4> Click and Drag to Highlight Available Blocks</h4>
</center>

<Table week={week} bind:availability={availability}/> 

<center>
<form on:submit|preventDefault="{handleSubmit}">
    <button>Submit</button>
</form>
</center>

<style>
    .grid-item-test {
        background-color: rgba(170, 240, 170, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 20px;
        font-size: 30px;
        text-align: center;
    }
</style>