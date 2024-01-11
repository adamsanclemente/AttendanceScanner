<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-left ml-8 font-bold text-2xl">Profile</h1>
<div class="bg-base-200 p-5 rounded-md m-8">
	<div class="flex justify-start pl-4 py-4">
		<div class="avatar placeholder">
			<div class="bg-neutral text-neutral-content rounded-full w-24">
				<span class="text-3xl">TU</span>
			</div>
		</div>
		<div class="flex flex-col py-4">
			<span class="text-2xl font-bold ml-4">{data.firstName} {data.lastName}</span>
			<span class="text-2xl font-thin ml-4">{data.username}</span>
		</div>
	</div>
</div>

<div class="bg-base-200 p-5 rounded-md m-8">
	<div class="flex justify-start gap-5 flex-row pl-4 py-2">
		<div class="flex justify-center items-center">
			<span class="text-lg font-semibold">Other Information</span>
		</div>

		<div class="divider divider-horizontal"></div>

		<div class="flex flex-col">
			<span class="text-md font-bold ml-4">Email</span>
			<span class="text-sm font-thin ml-4">{data.email}</span>
		</div>
		<div class="flex flex-col">
			<span class="text-md font-bold ml-4">ID</span>
			<span class="text-sm font-thin ml-4">{data.userId}</span>
		</div>
	</div>
</div>

<!-- TODO: Edit Account Info -->

<div class="m-8">
	<form method="post" action="?/logout" use:enhance>
		<input class="btn btn-error btn-block" type="submit" value="Sign out" />
	</form>
</div>

