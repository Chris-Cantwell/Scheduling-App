<script>
    import Table from './Table.svelte';

    let week = {
        // Add a blank precursor day to hold time block labels
        days: ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        earliest_time: {hour: 8, minute: 0}, // Time code, 24h hh:mm
        latest_time: {hour: 18, minute: 0}, // Time code, 24h hh:mm
        interval_minutes: 30 // Interval in Minutes
    }

</script>

<center>
    <h1> Please enter your availability! </h1>
</center>

<Table week={week}/> 

<style>
    .grid-item-test {
        background-color: rgba(170, 240, 170, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 20px;
        font-size: 30px;
        text-align: center;
    }
</style>