<script>
    import { LOGIN } from "./graphql";
    import { user, client } from "../stores"
    import { mutationStore } from '@urql/svelte';

    let username = "";
    let password = "";
    let result;

    const login = async () => {
        result = mutationStore({
            client,
            query: LOGIN,
            variables: { username, password },
        });

        result.subscribe(d => {
            if (d && d.data) {
                user.set(d.data.login)
            }
        })
    };

    const handleSubmit = async () => login()
</script>

<center>
    <h1>Please log in to continue:</h1>

<<<<<<< HEAD
    {#if form?.success}
        <p>Successfully logged in! Welcome back, {form?.name}</p>
        <a href="/scheduling">Continue</a>
=======
    {#if $user && $user.id}
        <p>Successfully logged in! Welcome back, {$user.username}</p>
>>>>>>> b6ba77c1de145fc3f3c83121300e68877bc38d90
    {/if}


    <form on:submit|preventDefault="{handleSubmit}">
        <label>
            Name:
            <input name="name" bind:value="{username}" type="text">
        </label>
        <label>
            Password:
            <input name="password" bind:value="{password}" type="password">
        </label>
        <button>Submit</button>
    </form>
</center>

<center>
    <h2>You have been invited to Ashleigh and Chris's Meeting</h2>
    <h3>Settings Description Here</h3>
</center>
