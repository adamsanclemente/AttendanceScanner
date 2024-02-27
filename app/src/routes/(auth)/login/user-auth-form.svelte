<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { cn } from "$lib/utils";
	import type { SupabaseClient } from "@supabase/supabase-js";

	export let supabase: SupabaseClient;

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}

	async function signInWithAzure() {
		await supabase.auth.signInWithOAuth({
			provider: 'azure',
			options: {
                scopes: 'openid profile email offline_access',
                redirectTo: 'http://localhost:5173/auth/callback'
			}
		});
	}
</script>

<div class={cn("grid gap-6", className)} {...$$restProps}>
	<Button variant="outline" type="button" disabled={isLoading} on:click={signInWithAzure}>
		{" "}
		Microsoft
	</Button>
</div>