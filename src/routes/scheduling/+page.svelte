<script>
    import Table from './Table.svelte';
    let test = 0;

    function handleClick(event) {
        console.log("User clicked");
        console.log(event);
    }

    function handleMouseMove(event) {
        console.log("Mouse Moving Through Div!")
    }

    let week = {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        //TODO: JS Date Objects
        earliest_time: "08:00", // Time code, 24h hh:mm
        latest_time: "24:00", // Time code, 24h hh:mm
        interval_min: 15 // Interval in Minutes
    }

</script>

<center>
    <h1> Please enter your availability! </h1>
    <Table week=week/> 
    <div class="grid-item-test" on:mousemove={handleMouseMove}>Test</div>
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