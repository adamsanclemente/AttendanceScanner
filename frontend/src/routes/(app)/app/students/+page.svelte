<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import type { PageData } from './$types';

	export let data: PageData;

	if (!data.props.students) {
		redirect(300, '/app');
	}
</script>

<h1 class="text-left ml-8 font-bold text-2xl">All Students</h1>

{#if data.props.students}
	{#each data.props.students as student}
		<div class="bg-base-200 p-5 rounded-md m-8">
			<div class="flex justify-between pl-4 py-4">
				<div class="flex flex-row">
					<div class="avatar placeholder">
						<div class="bg-blue-950 text-neutral-content rounded-full w-24">
							<span class="text-3xl">{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span
							>
						</div>
					</div>
					<div class="flex flex-col py-4">
						<span class="text-2xl font-bold ml-4">{student.firstName} {student.lastName}</span>
						<span class="text-md font-thin ml-4">ID: {student.student_id}</span>
					</div>

					<div class="flex flex-row justify-between items-center">
						<div class="m-3 flex flex-col">
							<span class="text-sm font-bold ml-4">Class:</span>
							<span class="text-sm font-thin ml-4">{student.class.class_id}</span>
						</div>
					</div>
				</div>
                <a class="btn btn-warning mx-4 mt-4" href="/app/student/${student.student_id}">View Student</a>
			</div>
		</div>
	{/each}
{/if}
