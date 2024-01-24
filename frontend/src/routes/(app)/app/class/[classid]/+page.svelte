<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-left ml-8 font-bold text-2xl">Class of {data.props.classData.class_id}</h1>
<div class="bg-base-200 p-5 rounded-md m-8">
	<div class="flex justify-left pl-4 py-4">
		<div class="flex flex-row">
			<div class="avatar placeholder">
				<div class="bg-blue-950 text-neutral-content rounded-full w-24">
					<span class="text-3xl">{data.props.classData.class_id}</span>
				</div>
			</div>
			<div class="flex flex-col py-4">
				<span class="text-2xl font-bold ml-4">{data.props.classData.class_id}</span>
				<span class="text-md font-thin ml-4">{data.props.classData.id}</span>
			</div>
		</div>

		<div class="flex flex-row justify-between items-center">
			<div class="m-3 flex flex-col">
				<span class="text-sm font-bold ml-4">Teacher(s):</span>
				{#each data.props.classData.teacher as t}
					<span class="text-sm font-thin ml-4">{t.user.firstName}</span>
				{/each}
			</div>

			<div class="m-3 flex flex-col">
				<span class="text-md font-bold ml-4">Students:</span>
				<span class="text-sm font-thin ml-4">{data.props.classData.students.length}</span>
			</div>
		</div>
	</div>
</div>

<div class="grid grid-cols-12">
    <div class="bg-base-200 p-5 rounded-md m-8 col-span-7 max-h-96">
        <h1 class="text-left ml-2 font-medium text-xl">Students</h1>
        <div class="divider"></div>
        <div class="overflow-y-auto h-96">
            {#each data.props.classData.students as s}
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row items-center">
                        <div class="flex flex-col align-middle items-center">
                            <div class="avatar placeholder flex flex-col justify-center">
                                <div class="bg-blue-950 text-neutral-content rounded-full w-12">
                                    <span class="text-3xl">{s.firstName[0]}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col py-4">
                            <span class="text-2xl font-bold ml-4">{s.firstName} {s.lastName}</span>
                            <span class="text-md font-thin ml-4">{s.email}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary ml-4 mt-4" on:click={() => {
                        window.location.href = `/app/student/${s.student_id}`;
                    }}>View Student</button>
                </div>
            {/each}
        </div>
    </div>

    <div class="col-span-5 bg-base-200 p-5 rounded-md m-8 max-h-96">
        <h1 class="text-left ml-2 font-medium text-xl">Today's Attendence</h1>
        <div class="divider"></div>

    </div>

    <div class="col-span-12 bg-base-200 p-5 rounded-md m-8 max-h-96">
        <h1 class="text-left ml-2 font-medium text-xl">Actions</h1>
        <div class="divider"></div>
    </div>
</div>
