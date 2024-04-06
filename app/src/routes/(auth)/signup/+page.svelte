<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { text } from '@sveltejs/kit';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
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
</script>

<div
	class="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Get Started</h1>
				<p class="text-sm text-muted-foreground">Sign up below</p>
			</div>
				<form action="?/signUp" method="POST">
					<div class="flex flex-col space-y-4">
						<div class="flex flex-col space-y-1">
							<Label for="email">Email</Label>
							<Input type="email" id="email" name="email" required />
						</div>

						<Button type="submit">Sign Up With Email</Button>
					</div>
				</form>
                
                <span class="text-sm text-muted-foreground w-full text-center">OR</span>

				<Button variant="outline" type="button" on:click={signInWithAzure}>
					Sign Up With Microsoft
				</Button>

                <span class="text-sm text-muted-foreground w-full text-center">Already have an account? <a class="text-primary" href="/login">Log In</a></span>

			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{' '}
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>{' '}
				and{' '}
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover bg-center"
			style="
				background-image:
					url(https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/02/Usign-Gradients-Featured-Image.jpg);"
		/>
		<div class="relative z-20 flex items-end justify-end text-lg font-medium">
			<!-- <Command class="mr-2 h-6 w-6" /> -->
			<span>Attendance Scanner</span>
		</div>
		<!-- <div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;This library has saved me countless hours of work and helped me deliver
					stunning designs to my clients faster than ever before. Highly
					recommended!&rdquo;
				</p>
				<footer class="text-sm">Sofia Davis</footer>
			</blockquote>
		</div> -->
	</div>
</div>
