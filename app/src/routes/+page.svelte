<script lang="typescript">
    export let data;
    let { supabase } = data;
    $: ({ supabase } = data);

	async function signInWithAzure() {
		await supabase.auth.signInWithOAuth({
			provider: 'azure',
			options: {
                scopes: 'openid profile email offline_access',
                redirectTo: 'http://localhost:5173/auth/callback'
			}
		});
	}

    async function signOut() {
        await supabase.auth.signOut();
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={signInWithAzure}>Sign in with Azure</button>
<br />
<button on:click={signOut}>Sign out</button>

{#if data.user}
    <p>Signed in as {data.user.email}</p>
{:else}
    <p>Not signed in</p>
{/if}