<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-left ml-8 font-bold text-2xl">Your Classes</h1>
{#each data.props.user.classes as c}
	<div class="bg-base-200 p-5 rounded-md m-8">
		<div class="flex justify-evenly  pl-4 py-4">
            <div class="flex flex-row">
                <div class="avatar placeholder">
                    <div class="bg-blue-950 text-neutral-content rounded-full w-24">
                        <span class="text-3xl">{c.class.class_id}</span>
                    </div>
                </div>
                <div class="flex flex-col py-4">
                    <span class="text-2xl font-bold ml-4">{c.class.class_id}</span>
                    <span class="text-md font-thin ml-4">{c.class.id}</span>
                </div>
            </div>
		
			<div class="flex flex-row justify-center items-center">
				<div class="m-3 flex flex-col">
					<span class="text-md font-bold ml-4">Teacher(s):</span>
					{#each c.class.teacher as t}
						<span class="text-sm font-thin ml-4">{t.user.firstName}</span>
					{/each}
				</div>

                <div class="m-3 flex flex-col">
                    <span class="text-md font-bold ml-4">Students:</span>
				<span class="text-sm font-thin ml-4">{c.class.students.length}</span>
				</div>
				<button class="btn btn-primary ml-4 mt-4" on:click={() => {
					window.location.href = `/app/class/${c.class.class_id}`;
				}}>View Class</button>
			</div>
		</div>
	</div>
{/each}
