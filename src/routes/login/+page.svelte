<script>
    /** @type {import('./$types').PageData} */
    export let data;
    
    /** @type {import('./$types').ActionData} */
    export let form;
</script>

<center>
    <h1>Please log in to continue:</h1>

    {#if form?.success}
        <p>Successfully logged in! Welcome back, {form?.name}</p>
    {/if}


    <form method="POST" action="?/login">
        <label>
            Name:
            <input name="name" type="text">
        </label>
        <label>
            Password:
            <input name="password" type="password">
        </label>
        <button>Submit</button>
    </form>
</center>

<center>
    <h2>You have been invited to Ashleigh and Chris's Meeting</h2>
    <h3>Settings Description Here</h3>
</center>
