<script>
    import Table from './Table.svelte';
    let test = 0;

    function handleClick(event) {
        console.log("User clicked");
        console.log(event);
    }

    let mousepos = { x: 0, y: 0 }

    function handleMouseMove(event) {
        console.log("Mouse Moving Through Div!");
        mousepos.x = event.clientX;
        mousepos.y = event.clientY;
    }

    let week = {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        earliest_time: {hour: 8, minute: 0}, // Time code, 24h hh:mm
        latest_time: {hour: 18, minute: 0}, // Time code, 24h hh:mm
        interval_min: 15 // Interval in Minutes
    }

</script>

<center>
    <h1> Please enter your availability! </h1>
    <div class="grid-item-test" on:mousedown={handleMouseMove}>Test -- Mouse is at {mousepos.x}, {mousepos.y}</div>
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