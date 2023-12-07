<!-- routes/signup/+page.svelte -->
<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>
<div class="text-center card">
	<h1 class="text-4xl">Sign up</h1>
	<p class="text-lg">Create an account to get started</p>
	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}

	<form method="post" use:enhance>
		<label for="username">Username</label>
		<input name="username" id="username" /><br />
		<label for="email">email</label>
		<input name="email" id="email" /><br />
		<label for="firstName">firstName</label>
		<input name="firstName" id="firstName" /><br />
		<label for="lastName">lastName</label>
		<input name="lastName" id="lastName" /><br />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" /><br />
		<input class="btn btn-primary w-72 m-1.5" type="submit"/>
	</form>
</div>
