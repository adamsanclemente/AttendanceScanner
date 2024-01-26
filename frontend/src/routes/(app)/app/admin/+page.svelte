<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-left ml-8 font-bold text-2xl">Admin Settings</h1>
<div class="bg-base-200 p-5 rounded-md m-8">
	<h2 class="text-left ml-3 font-semibold text-lg">Users</h2>
	<div class="divider"></div>
	<table class="table">
		<thead>
			<tr>
                <th></th>
				<th>User</th>
				<th>Username</th>
				<th>Admin Permission</th>
				<th>Classes</th>
                <th>Edit</th>
			</tr>
		</thead>
		<tbody>
			{#each data.props.users as u}
				<tr>
                    <td></td>
                    <td>
                        <div class="flex items-center gap-3">
                            <div class="avatar">
                                <div class="mask mask-squircle w-12 h-12">
                                    <img src={u.image} alt="Avatar" />
                                </div>
                            </div>
                            <div>
                                <div class="font-bold">{u.firstName + ' ' + u.lastName}</div>
                                <div class="text-sm opacity-50">{u.email}</div>
                            </div>
                        </div>
                    </td>
					<td>{u.username}</td>
					<td>{u.admin ? 'Yes' : 'No'}</td>
					<td>
						{u.classes.length}
					</td>
                    <td>
                        <a href={'/app/admin/users/' + u.id}>
                            <button class="btn btn-primary">Edit</button>
                        </a>
                    </td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Card for Classes -->
<div class="bg-base-200 p-5 rounded-md m-8">
    <h2 class="text-left ml-3 font-semibold text-lg">Classes</h2>
    <div class="divider"></div>
    <table class="table">
        <thead>
            <tr>
                <th></th>
                <th>Class ID</th>
                <th>Teacher(s)</th>
                <th>Students</th>
                <th>Edit</th>
            </tr>
        </thead>
        <tbody>
            {#each data.props.classes as c}
                <tr>
                    <td></td>
                    <td>{c.class_id}</td>
                    <td>
                        {#each c.teacher as t}
                            {t.user.firstName + ' ' + t.user.lastName}
                        {/each}
                    </td>
                    <td>{c.students.length}</td>
                    <td>
                        <a href={'/app/admin/classes/' + c.id}>
                            <button class="btn btn-primary">Edit</button>
                        </a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- Cards for stuudents -->

<div class="bg-base-200 p-5 rounded-md m-8">
    <h2 class="text-left ml-3 font-semibold text-lg">Students</h2>
    <div class="divider"></div>
    <table class="table">
        <thead>
            <tr>
                <th></th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Edit</th>
            </tr>
        </thead>
        <tbody>
            {#each data.props.students as s}
                <tr>
                    <td></td>
                    <td>{s.student_id}</td>
                    <td>{s.firstName + ' ' + s.lastName}</td>
                    <td>{s.class.class_id}</td>
                    <td>
                        <a href={'/app/admin/students/' + s.id}>
                            <button class="btn btn-primary">Edit</button>
                        </a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>