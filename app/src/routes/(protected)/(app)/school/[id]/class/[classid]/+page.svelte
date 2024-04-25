<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
    import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Form from '$lib/components/ui/form';
    import * as Select from '$lib/components/ui/select';
    import * as Alert from '$lib/components/ui/alert';
    import { AlertCircle } from 'lucide-svelte';
    import { Loader2 } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { manualAttendanceSchema, updateStudentsToClassSchema, updateClassSettingsSchema } from '$lib/config/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let data: PageData;
	let c = data.class;
	let unmarkedStudents = data.unmarkedStudents;
    if (unmarkedStudents === undefined) {
        unmarkedStudents = [];
    }

	let records = data.records;
    let students = data.students;
	let admin = data.admin;
	let today = new Date().toLocaleDateString();
	let isAbsentTime = new Date();
	let [hours, minutes] = c.emailTime.split(':').map(Number);
	isAbsentTime.setHours(hours, minutes, 0, 0);
	let isAbsent = new Date() > isAbsentTime;

    let manualAttendance = manualAttendanceSchema.pick({
        class_id: true,
        reason: true,
        student_id: true,
        status: true,
    });

	let updateStudents = updateStudentsToClassSchema.pick({
		students: true,
	});

    let updateClassSettings = updateClassSettingsSchema.pick({
        name: true,
        description: true,
        email_enable: true,
        email_time: true,
        users: true,
        users_roles: true,
    });

    type ManualAttendance = typeof manualAttendance;
    export let form: SuperValidated<ManualAttendance>;
    export let formAddStudents: SuperValidated<typeof updateStudents>;
    export let formClassSettings: SuperValidated<typeof updateClassSettings>;
    form = data.form;
	formAddStudents = data.formAddStudents;
    formClassSettings = data.formUpdateClassSettings;

	let addStudents = [];

	const studentsInClass = data.studentsInSchool.map(s => ({
		student: s, 
		inClass: students.some(st => st.student.id === s.id)
	}));

    let open2: boolean;
	let openAddStudent: boolean;
    let openSettings: boolean;
</script>

<svelte:head>
	<title>{c.name} | Attendance Scanner</title>
</svelte:head>

<section class="container grid items-center gap-6 pb-4 border-b">
	<div class="flex flex-row justify-between gap-2 min-w-full items-center">
		<div class="flex flex-col">
			<h1 class="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
				{c.name}
			</h1>
			<p class="text-lg text-gray-300">
				{c.description ? c.description : 'No description available.'}
			</p>
		</div>
		<div class="flex flex-row gap-4">
			{#if admin}
                <Dialog.Root bind:open={openSettings}>
                    <Dialog.Trigger class="w-full">
                        <Button variant="link" class="text-md text-white">
                            Settings
                        </Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Settings</Dialog.Title>
                            <Dialog.Description>Update the class settings</Dialog.Description>
                        </Dialog.Header>
                        <Form.Root let:submitting let:errors method="POST" form={formClassSettings} action="?/updateSettings" schema={updateClassSettingsSchema} let:config>
                            <div class="grid gap-4 py-4">
                                {#if errors?._errors?.length}
                                    <Alert.Root variant="destructive">
                                        <AlertCircle class="h-4 w-4" />
                                        <Alert.Title>Error</Alert.Title>
                                        <Alert.Description>
                                            {#each errors._errors as error}
                                                {error}
                                            {/each}
                                        </Alert.Description>
                                    </Alert.Root>
                                {/if}
                                <Form.Field {config} name="name" let:value let:setValue>
                                    {setValue(c.name),''}
                                    <Form.Item>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Input {value} />
                                        <Form.Validation />
                                    </Form.Item>
                                </Form.Field>
                                <Form.Field {config} name="description" let:value let:setValue>
                                    {setValue(c.description),''}
                                    <Form.Item>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Textarea {value} />
                                        <Form.Validation />
                                    </Form.Item>
                                </Form.Field>
                                <Form.Field {config} name="email_enable" let:value let:setValue>
                                    {setValue(c.enableEmail.toString()),''}
                                    <Form.Item>
                                        <Form.Label>Enable Emails</Form.Label>
                                        <Form.Select>
                                            <Select.Trigger>
                                                <Select.Value placeholder="Select an option" />
                                            </Select.Trigger>
                                            <Select.Content>
                                                <Select.Item value="true">Yes</Select.Item>
                                                <Select.Item value="false">No</Select.Item>
                                            </Select.Content>
                                        </Form.Select>
                                        <Form.Validation />
                                    </Form.Item>
                                </Form.Field>

                                <!-- users -->
                                <Table.Root>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.Head>User</Table.Head>
                                            <Table.Head>Role</Table.Head>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body class="max-h-[600px] overflow-y-auto">
                                        {#each data.users as user, i}
                                            {@const classUser = c.users.find(u => u.userId === user.id)}
                                            <Table.Row>
                                                <Table.Cell>{user.firstName + ' ' + user.lastName}</Table.Cell>
                                                <Table.Cell>
                                                    <input type="hidden" name="users[{i}]" value={user.id} />
                                                    <Form.Field {config} name="users_roles[{i}]" let:value let:setValue>
                                                        {setValue(classUser ? classUser.role : 'TEACHER'),''}
                                                        <Form.Item>
                                                            <Form.Select>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select a role"></Select.Value>
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    <Select.Item value="TEACHER">Teacher</Select.Item>
                                                                    <Select.Item value="ADMIN">Admin</Select.Item>
                                                                </Select.Content>
                                                            </Form.Select>
                                                            <Form.Validation />
                                                        </Form.Item>
                                                    </Form.Field>
                                                </Table.Cell>
                                            </Table.Row>
                                        {/each}
                                    </Table.Body>
                                </Table.Root>


                                <Form.Field {config} name="email_time" let:value let:setValue>
                                    {setValue(`${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`),''}
                                    <Form.Item>
                                        <Form.Label>Email Time</Form.Label>
                                        <Form.Input type="time" {value}/>
                                        <Form.Validation />
                                    </Form.Item>
                                </Form.Field>


                                <Button type="submit" disabled={submitting} class="text-md text-white" on:click={()=> {
                                    const t = setInterval(() => {
                                        if (submitting) return;
                                        openSettings = false;
                                        clearInterval(t);
                                        setTimeout(() => location.reload(), 100);
                                    }, 100);
                                }}>Submit</Button>
                            </div>
                        </Form.Root>
                    </Dialog.Content>
                </Dialog.Root> 
			{/if}
		</div>
	</div>
</section>

<section class="container grid grid-cols-6 py-4 gap-8">
	<Card.Root class="col-span-4">
		<Card.Header>
			<Card.Title>Today's Attendance ({today}):</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Head>Student</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Header>
				<Table.Body class="max-h-[600px] overflow-y-auto">
					{#each records as record}
						<Table.Row>
							<Table.Cell>{record.student.firstName + ' ' + record.student.lastName}</Table.Cell>
							<Table.Cell>
								{#if record.status === 'PRESENT'}
									<Badge variant="default">PRESENT</Badge>
								{:else if record.status === 'ABSENT'}
									<Badge variant="destructive">ABSENT</Badge>
								{:else if record.status === 'TARDY'}
									<Badge class="bg-yellow-600 hover:bg-yellow-700">TARDY</Badge>
								{:else if record.status === 'COOP'}
									<Badge class="bg-blue-600 hover:bg-blue-700">COOP</Badge>
								{:else}
									<Badge variant="outline">{record.status}</Badge>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}

					{#each unmarkedStudents as s}
						<Table.Row>
							<Table.Cell>{s.student.firstName + ' ' + s.student.lastName}</Table.Cell>
							<Table.Cell>
								{#if isAbsent}
									<Badge variant="destructive">ABSENT</Badge>
								{:else}
									<Badge variant="outline">UNMARKED</Badge>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
        <Card.Footer>
            <Dialog.Root bind:open={open2}>
                <Dialog.Trigger class="w-full">
                    <Button
                    variant="outline"
                    class="w-full"
                >
                    Manual Attendance
                </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Manual Attendance</Dialog.Title>
                        <Dialog.Description>Fill out the form to mark attendance for a student</Dialog.Description>
                    </Dialog.Header>
                    <Form.Root let:submitting let:errors method="POST" {form} action="?/manualAttendance" schema={manualAttendanceSchema} let:config>
                        <div class="grid gap-4 py-4">
                            {#if errors?._errors?.length}
                                <Alert.Root variant="destructive">
                                    <AlertCircle class="h-4 w-4" />
                                    <Alert.Title>Error</Alert.Title>
                                    <Alert.Description>
                                        {#each errors._errors as error}
                                            {error}
                                        {/each}
                                    </Alert.Description>
                                </Alert.Root>
                            {/if}
                            <Form.Field {config} name="student_id">
                                <Form.Item>
                                    <Form.Label>Student*</Form.Label>
                                    <Form.Select>
                                        <Select.Trigger><Select.Value placeholder="Select a student"></Select.Value></Select.Trigger>
                                        <Select.Content>
                                            {#each students as s}
                                                <Select.Item value={s.student.id}>{s.student.firstName + ' ' + s.student.lastName}</Select.Item>
                                            {/each}
                                        </Select.Content>
                                    </Form.Select>
                                    <Form.Validation />
                                </Form.Item>
                            </Form.Field>
                            <Form.Field {config} name="status">
                                <Form.Item>
                                    <Form.Label>Status*</Form.Label>
                                    <Form.Select>
                                        <Select.Trigger><Select.Value placeholder="Select a status"></Select.Value></Select.Trigger>
                                        <Select.Content>
                                            <Select.Item value="PRESENT">Present</Select.Item>
                                            <Select.Item value="ABSENT">Absent</Select.Item>
                                            <Select.Item value="TARDY">Tardy</Select.Item>
                                            <Select.Item value="COOP">Coop</Select.Item>
                                        </Select.Content>
                                    </Form.Select>
                                    <Form.Validation />
                                </Form.Item>
                            </Form.Field>
                            <Form.Field {config} name="reason">
                                <Form.Item>
                                    <Form.Label>Reason</Form.Label>
                                    <Form.Input />
                                    <Form.Validation />
                                </Form.Item>
                            </Form.Field>
                            <Button type="submit" disabled={submitting} class="text-md text-white" on:click={()=> {open2 = false}}>Submit</Button>
                        </div>
                    </Form.Root>
                </Dialog.Content>
            </Dialog.Root>

        </Card.Footer>
	</Card.Root>

    <Card.Root class="col-span-2">
        <Card.Header>
            <Card.Title>All Students</Card.Title>
        </Card.Header>
        <Card.Content>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head>Student</Table.Head>
                        <Table.Head>Actions</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body class="max-h-[600px] overflow-y-auto">
                    {#each students as s}
                        <Table.Row>
                            <Table.Cell>{s.student.firstName + ' ' + s.student.lastName}</Table.Cell>
                            <Table.Cell>
                                <Button
                                    href="/school/{c.schoolId}/students/{s.studentId}"
                                    variant="default"
                                    class="w-full"
                                >
                                    View
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </Card.Content>
		
        <Card.Footer>
            <Dialog.Root bind:open={openAddStudent}>
                <Dialog.Trigger class="w-full">
                    <Button
                    variant="outline"
                    class="w-full"
                >
                    Add Students to Class
                </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Add Students</Dialog.Title>
                        <Dialog.Description>Select students to add to the class</Dialog.Description>
                    </Dialog.Header>
                    <Form.Root let:submitting let:errors method="POST" form={formAddStudents} action="?/updateStudents" schema={updateStudentsToClassSchema}>
                        <div class="grid gap-4 py-4">
                            {#if errors?._errors?.length}
                                <Alert.Root variant="destructive">
                                    <AlertCircle class="h-4 w-4" />
                                    <Alert.Title>Error</Alert.Title>
                                    <Alert.Description>
                                        {#each errors._errors as error}
                                            {error}
                                        {/each}
                                    </Alert.Description>
                                </Alert.Root>
                            {/if}
							<Table.Root>
							<Table.Header>
								<Table.Head>In Class?</Table.Head>
								<Table.Head>Student</Table.Head>
								<Table.Head>Year</Table.Head>
							</Table.Header>
								<Table.Body class="max-h-[600px] overflow-y-auto">
									{#each studentsInClass as {student, inClass}, i}
										<Table.Row>
											<Table.Cell>
												<Checkbox bind:checked={inClass} />
												<input type="checkbox" bind:group={addStudents} bind:checked={inClass} name="students" value={student.id} hidden />
											</Table.Cell>
											<Table.Cell>{student.firstName + ' ' + student.lastName}</Table.Cell>
											<Table.Cell>
												<Badge variant="default">{student.gradYear}</Badge>
											</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
                            <Button type="submit" disabled={submitting} class="text-md text-white" on:click={()=> {
								const t = setInterval(() => {
									if (submitting) return;
									openAddStudent = false;
									clearInterval(t);
									setTimeout(() => location.reload(), 100);
								}, 100);
							}}>Submit</Button>
                        </div>
                    </Form.Root>
                </Dialog.Content>
            </Dialog.Root>
        </Card.Footer>
    </Card.Root>
</section>
