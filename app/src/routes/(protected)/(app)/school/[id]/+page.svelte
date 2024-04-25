<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Form from '$lib/components/ui/form';
    import * as Alert from '$lib/components/ui/alert';
    import { AlertCircle } from 'lucide-svelte';
    import { Loader2 } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { createClassSchema, createStudentSchema, editSchoolSchema } from '$lib/config/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: PageData;
	let school = data.school;
	let classes = data.classes;
	let students = data.school.students;
	let admin = data.admin;

    const ClassSchema = createClassSchema.pick({
        class_name: true,
        description: true
    });

    type ClassSchema = typeof ClassSchema;
    export let form: SuperValidated<ClassSchema>;
    form = data.form;

    const StudentSchema = createStudentSchema.pick({
        first_name: true,
        last_name: true,
        email: true,
        grad_year: true,
        school_id: true,
    });

    type StudentSchema = typeof StudentSchema;
    export let addForm: SuperValidated<StudentSchema>;
    addForm = data.addForm;

    const schoolSchema = editSchoolSchema.pick({
        school_name: true,
        description: true
    });

    type SchoolSchema = typeof schoolSchema;
    export let editForm: SuperValidated<SchoolSchema>;
    editForm = data.editForm;

    let open: boolean;
    let open1: boolean;
    let open3: boolean;

</script>

<svelte:head>
	<title>{school.name} | Attendance Scanner</title>
</svelte:head>

<section class="container flex items-center gap-6 pb-4 border-b">
	<div class="flex flex-row justify-between gap-2 min-w-full items-center">
		<div class="flex flex-col">
			<h1 class="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
				{school.name}
			</h1>
			<p class="text-lg text-gray-300">{school.description ? school.description : 'No description available.'}</p>
		</div>
		<div class="flex flex-row gap-4">
			{#if admin}
                <Dialog.Root bind:open={open1}>
                    <Dialog.Trigger>
                        <Button variant="link" class="text-md text-white"
                            >+ Add Student</Button
                        >
                    </Dialog.Trigger>
        
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Create Student</Dialog.Title>
                            <Dialog.Description>Fill out the form to create a new student</Dialog.Description>
                        </Dialog.Header>
                        <Form.Root let:submitting let:errors method="POST" action="?/addStudent" form={addForm} schema={createStudentSchema} let:config on:submit={()=> {open1 = false}}>
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
                                    <Form.Field {config} name="first_name">
                                        <Form.Item>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>
                                    <Form.Field {config} name="last_name">
                                        <Form.Item>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>
                                    <Form.Field {config} name="email">
                                        <Form.Item>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>
                                    <Form.Field {config} name="grad_year">
                                        <Form.Item>
                                            <Form.Label>Grad Year</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>

                                    <Form.Field {config} name="school_id">
                                        <Form.Item>
                                            <Form.Label>School ID</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>
                            </div>
                            <Dialog.Footer>
                                <Form.Button type="submit" class="w-full" disabled={submitting} 
                                >{#if submitting}
                                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                                    Please wait{:else}Submit{/if}
                            </Form.Button>
                            </Dialog.Footer>
                        </Form.Root>
                    </Dialog.Content>
                </Dialog.Root>
                <Dialog.Root bind:open={open3}>
                    <Dialog.Trigger>
                        <Button variant="link" class="text-md text-white"
                            >Edit School</Button
                        >
                    </Dialog.Trigger>
        
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Edit School</Dialog.Title>
                            <Dialog.Description>Fill out the form to edit the school</Dialog.Description>
                        </Dialog.Header>
                        <Form.Root let:submitting let:errors method="POST" action="?/editSchool" form={editForm} schema={editSchoolSchema} let:config on:submit={()=> {open3 = false}}>
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
                                    <Form.Field {config} name="school_name">
                                        <Form.Item>
                                            <Form.Label>School Name</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>
                                    <Form.Field {config} name="description">
                                        <Form.Item>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>
                                
                            </div>
                            <Dialog.Footer>
                                <Form.Button type="submit" class="w-full" disabled={submitting} 
                                >{#if submitting}
                                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                                    Please wait{:else}Submit{/if}
                            </Form.Button>
                            </Dialog.Footer>
                        </Form.Root>
                    </Dialog.Content>
                </Dialog.Root>
                <Dialog.Root bind:open={open}>
                    <Dialog.Trigger>
                        <Button variant="default" class="text-md text-white"
                        >+ New Class</Button
                    >
                    </Dialog.Trigger>
        
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Create Class</Dialog.Title>
                            <Dialog.Description>Fill out the form to create a new class</Dialog.Description>
                        </Dialog.Header>
                        <Form.Root let:submitting let:errors method="POST" action="?/addClass" {form} schema={createClassSchema} let:config on:submit={()=>{open = false}}>
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
                                    <Form.Field {config} name="class_name">
                                        <Form.Item>
                                            <Form.Label>Class Name</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>
                                    <Form.Field {config} name="description">
                                        <Form.Item>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Input />
                                            <Form.Validation />
                                        </Form.Item>
                                    </Form.Field>
                                
                            </div>
                            <Dialog.Footer>
                                <Form.Button type="submit" class="w-full" disabled={submitting} 
                                >{#if submitting}
                                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                                    Please wait{:else}Submit{/if}
                            </Form.Button>
                            </Dialog.Footer>
                        </Form.Root>
                    </Dialog.Content>
                </Dialog.Root>
			{/if}
		</div>
	</div>
</section>

<section class="container grid items-center gap-6 py-5">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h2 class="font-bold leading-tight tracking-tighter md:text-3xl">Your Classes</h2>
	</div>

	<div class="grid grid-cols-3 gap-4">
		{#each classes as c}
			<Card.Root>
				<Card.Header>
					<Card.Title>{c.name}</Card.Title>
					<Card.Description
						>{c.description ? c.description : 'No description available.'}</Card.Description
					>
				</Card.Header>
				<Card.Footer>
					<Button href="/school/{school.id}/class/{c.id}" variant="default" class="w-full"
						>View Class</Button
					>
				</Card.Footer>
			</Card.Root>
		{/each}

		{#if school.classes.length === 0}
			<p class="text-gray-300">No classes available.</p>
		{/if}
	</div>
</section>

<!-- Section for students-->

<section class="container py-5">
	<div class="flex max-w-[980px] flex-col items-start gap-2 py-4">
		<h2 class="font-bold leading-tight tracking-tighter md:text-3xl">All Students</h2>
	</div>
	<Table.Root>
		<Table.Caption>All Students</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>ID</Table.Head>
				<Table.Head>First Name</Table.Head>
				<Table.Head>Last Name</Table.Head>
                <Table.Head>Grad Year</Table.Head>
				<Table.Head>Email</Table.Head>
				<Table.Head>Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body class="max-h-[600px] overflow-y-auto">
			{#each school.students as student}
				<Table.Row>
					<Table.Cell>{student.id}</Table.Cell>
					<Table.Cell>{student.firstName}</Table.Cell>
					<Table.Cell>{student.lastName}</Table.Cell>
                    <Table.Cell>{student.gradYear}</Table.Cell>
					<Table.Cell>{student.email}</Table.Cell>
					<Table.Cell>
						<Button href="/school/{school.id}/students/{student.id}" variant="outline">View</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</section>
