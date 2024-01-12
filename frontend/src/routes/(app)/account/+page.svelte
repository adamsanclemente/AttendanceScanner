<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-left ml-8 font-bold text-2xl">Edit Account</h1>
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

<div class="grid grid-cols-2 gap-8 m-8">

	<!-- Edit Information Card -->
<section class="card col-span-2 bg-base-200 xl:col-span-1 justify-center">
	<form class="card-body" method="POST" action="?/updatePersonal" use:enhance>

		<h2 class="card-title">Account Information</h2>

		<div class="form-control">
			<label for="email" class="label">
				<span class="label-text">Email</span>
			</label>
			<input
				id="email"
				name="email"
				type="text"
				class="input input-bordered font-mono"
				title="Your Email"
				value={data.email}
				required
			/>
		</div>

		<div class="form-control">
			<label for="username" class="label">
				<span class="label-text">Username</span>
			</label>
			<input
				id="username"
				name="username"
				type="text"
				class="input input-bordered font-mono"
				title="Your Username"
				value={data.username}
				required
			/>
		</div>

		<div class="form-control">
			<label for="password" class="label">
				<span class="label-text">New Password</span>
			</label>
			<input
				id="password"
				name="password"
				type="password"
				class="input input-bordered font-mono"
				title="New Password"
				required
			/>
		</div>
		<div class="form-control">
			<div class="flex items-end py-4">
				<button class="btn btn-primary grow">Update Account Information</button>
			</div>
		</div>

	</form>
</section>
<!-- /Edit Account Information Card -->

<!-- Edit Profile Information Card -->
<section class="card col-span-2 bg-base-200 xl:col-span-1 justify-center">
	<form class="card-body" method="POST" action="?/updateProfile">

		<h2 class="card-title">Profile Information</h2>

		<div class="form-control">
			<label for="firstName" class="label">
				<span class="label-text">First Name</span>
			</label>
			<input
				id="firstName"
				name="firstName"
				type="text"
				title="Your First Name"
				value={data.firstName}
				required
				class="input input-bordered text-center font-mono"
			/>
		</div>

		<div class="form-control">
			<label for="lastName" class="label">
				<span class="label-text">Last Name</span>
			</label>
			<input
				id="lastName"
				name="lastName"
				type="text"
				title="Your Last Name"
				value={data.lastName}
				required
				class="input input-bordered text-center font-mono"
			/>
		</div>

		<div class="form-control">
			<label for="image" class="label">
				<span class="label-text">Profile Image</span>
			</label>
			<input
				id="image"
				name="image"
				type="text"
				title="Your Profile Image"
				value={data.image}
				class="input input-bordered text-center font-mono"
			/>
		</div>

		<input type="hidden" name="userId" value={data.userId} required />
	
		<div class="form-control">
			<div class="flex items-end py-4">
				<button class="btn btn-primary grow">Update Profile Information</button>
			</div>
		</div>
	</form>
</section>
<!-- /Edit Personal Information Card -->

</div>



<div class="m-8">
	<form method="post" action="?/logout" use:enhance>
		<input class="btn btn-error btn-block" type="submit" value="Sign out" />
	</form>
</div>

