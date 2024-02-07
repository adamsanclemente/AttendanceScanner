<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import type { PageData } from './$types';

	export let data: PageData;

	if (!data.props.studentData) {
		redirect(300, '/app');
	}
</script>

{#if data.props.studentData}
	<h1 class="text-left ml-8 font-bold text-2xl">Viewing {data.props.studentData.firstName} {data.props.studentData.lastName}</h1>
	<div class="bg-base-200 p-5 rounded-md m-8">
		<div class="flex justify-left pl-4 py-4">
			<div class="flex flex-row">
				<div class="avatar placeholder">
					<div class="bg-blue-950 text-neutral-content rounded-full w-24">
						<span class="text-3xl">{data.props.studentData.firstName.charAt(0)}{data.props.studentData.lastName.charAt(0)}</span>
					</div>
				</div>
				<div class="flex flex-col py-4">
					<span class="text-2xl font-bold ml-4">{data.props.studentData.firstName} {data.props.studentData.lastName}</span>
					<span class="text-md font-thin ml-4">ID: {data.props.studentData.student_id}</span>
				</div>
			</div>

			<div class="flex flex-row justify-between items-center">
				<div class="m-3 flex flex-col">
					<span class="text-sm font-bold ml-4">Class:</span>
						<span class="text-sm font-thin ml-4">{data.props.studentData.class.class_id}</span>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-12">

		<div class="col-span-12 bg-base-200 p-5 rounded-md m-8 max-h-96">
			<h1 class="text-left ml-2 font-medium text-xl">Actions</h1>
			<div class="divider"></div>
			<div class="flex flex-row justify-evenly">
				{#if data.props.studentData}
					<!-- Edit Records -->
					<a
						class="btn btn-warning ml-4 mt-4"
					href="/app/student/{data.props.studentData.student_id}/records/edit">Edit Records</a
					>
					<!-- Edit Attendence -->
					<a
						class="btn btn-warning btn-outline ml-4 mt-4"
						href="/app/students/{data.props.studentData.student_id}/attendence/edit">Edit Attendence</a
					>
				{/if}
			</div>
		</div>
	</div>
{/if}
