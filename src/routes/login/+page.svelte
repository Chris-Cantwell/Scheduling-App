<script>
    import { LOGIN } from "./graphql";
    import { user, client } from "../stores"
    import { mutationStore } from '@urql/svelte';
    import { goto } from '$app/navigation';
    import { Alert } from 'sveltestrap';

    let username = "";
    let password = "";
    let result;
    let openAlert = false;

    user.subscribe(d => {
        if (d && d.id) {
            goto("/scheduling")
        }
    })

    const login = async () => {
        result = mutationStore({
            client,
            query: LOGIN,
            variables: { username, password },
        });

        result.subscribe(d => {
            if (d) {
                username = "";
                password = "";
                if (d.data) {
                    user.set(d.data.login)
                    openAlert = false;
                } else if (d.error) {
                    openAlert = true;
                }
            }
        })
    };

    const handleSubmit = async () => login()
</script>

<style>
    body {
        background-color: #FBFCFF;
        margin-left: 30px;
        min-height: 100vh;
    }
    .main {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .firstDiv {
        min-width: 550px;
    }
    button {
        display: inline-block;
        width: 400px;
        height: 50px;
        background: #E25661;
        box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.094);        
        border-radius: 80px;
        border-color: transparent;
        margin-top: 15px;
        font-family: 'Nunito';
        font-style: normal;
        font-weight: 800;
        font-size: 18px;
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
    .title {
        margin-top: 70px;
        max-width: 550px;
        min-width: 550px;
        font-family: 'Overpass';
        font-style: normal;
        font-weight: 800;
        font-size: 35px;
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
        margin-bottom: 30px;
        color: #444B59;
    }
    .calendar {
        width: 600px;
        height: 400.34px;
        box-shadow: 3px 4px 4px 1px rgba(0, 0, 0, 0.25);
        border-radius: 30px;
        margin-left: 50px;
    }
    input {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 24px 32px;
        gap: 10px;
        width: 400px;
        height: 45px;
        background: #FBFCFF;
        border: 2px solid #E3778B;
        border-radius: 80px;
        box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.094); 
        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
        margin-bottom: 5px;
        margin-top: 5px;
        font-size: 14px;
        letter-spacing: 0.1em;
        color: #444B59;
        font-family: 'Nunito';
    }
</style>

<Alert color="danger" dismissible fade isOpen={openAlert} toggle={() => (openAlert = false)}>
    <h4 class="alert-heading text-capitalize">Incorrect password</h4>
    That name is already in use. Try again.
</Alert>

<body>
<p class="title">WELCOME to Ashleigh and Chris’s Event!</p>
<div class="main">
    <div class="firstDiv">
        <p class="body">
            Sign in to indicate your availability.
            <br />
            New to the event? Create your password.
        </p>
        <form on:submit|preventDefault="{handleSubmit}">
            <label class="body">
                Name
                <input name="name" bind:value="{username}" type="text">
            </label>
            <label class="body">
                Password
                <input name="password" bind:value="{password}" type="password">
            </label>
            <button disabled='{!username || !password}'>Continue</button>
        </form>
    </div>
    <img class="calendar" src='/src/images/calendarImg.jpg' alt="Calendar">
</div>
</body>
