<script lang="ts">
    import type { PageData } from './$types';
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Form from '$lib/components/ui/form';
    import * as Alert from '$lib/components/ui/alert';
    import * as Table from '$lib/components/ui/table';
    import { AlertCircle } from 'lucide-svelte';
    import { Loader2 } from 'lucide-svelte';
    import { Badge } from '$lib/components/ui/badge';
	import type { SuperValidated } from 'sveltekit-superforms';
    import { deleteStudentSchema, updateStudentSchema } from '$lib/config/zod-schemas';
    
    export let data: PageData;
    let student = data.student;
    let admin = data.admin;

    const deleteSchema = deleteStudentSchema.pick({
        confirm: true
    });

    type deleteSchema = typeof deleteSchema;

    export let deleteForm: SuperValidated<deleteSchema>
    deleteForm = data.deleteForm;

    const updateSchema = updateStudentSchema.pick({
        school_id: true,
        first_name: true,
        last_name: true,
        email: true,
        grad_year: true
    });

    type updateSchema = typeof updateSchema;

    export let updateForm: SuperValidated<updateSchema>
    updateForm = data.updateForm;
    let open: boolean
    let open2: boolean
</script>

<svelte:head>
    <title>{student.firstName} | Attendance Scanner</title>
</svelte:head>

<section class="container grid items-center gap-6 pb-4 border-b">
    <div class="flex flex-row justify-between gap-2 min-w-full items-center">
        <div class="flex flex-col">
            <h1 class="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                {student.firstName  + ' ' + student.lastName + ' ' + `(${student.gradYear})`}
            </h1>
            <p class="text-lg text-gray-300">
                {student.email} | {student.id}
            </p>
        </div>
        <div class="flex flex-row gap-4">
            {#if admin}
                <Dialog.Root bind:open={open}>
                    <Dialog.Trigger>
                        <Button variant="default" class="text-md text-white">Edit Student</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Edit Student</Dialog.Title>
                            <Dialog.Description>Update the student's information below.</Dialog.Description>
                        </Dialog.Header>
                        <Form.Root let:submitting let:errors method="POST" action="?/update" form={updateForm} schema={updateSchema} let:config>
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
                                        <Form.Label>Graduation Year</Form.Label>
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
                                <Button type="submit" disabled={submitting} class="text-md text-white" on:click={()=> {open = false}}>Update</Button>
                            </div>
                        </Form.Root>
                    </Dialog.Content>
                </Dialog.Root>
                <Dialog.Root bind:open={open2}>
                    <Dialog.Trigger>
                        <Button variant="destructive" class="text-md text-white">Delete Student</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Delete Student</Dialog.Title>
                            <Dialog.Description>Are you sure you want to delete {student.firstName + ' ' + student.lastName}</Dialog.Description>
                        </Dialog.Header>
                        <Form.Root let:submitting let:errors method="POST" action="?/delete" form={deleteForm} schema={deleteSchema} let:config>
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
                                <Form.Field {config} name="confirm">
                                    <Form.Item>
                                        <Form.Label>Confirm</Form.Label>
                                        <Form.Input  placeholder="DELETE"/>
                                        <Form.Validation />
                                    </Form.Item>
                                </Form.Field>
                                <Button type="submit" disabled={submitting} class="text-md text-white" on:click={()=> {open2 = false}}>Delete</Button>
                            </div>
                        </Form.Root>
                    </Dialog.Content>
                </Dialog.Root>
            {/if}
            <Button
            href="/school/{student.schoolId}"
            variant="outline"
            class="text-md text-white">Back to School</Button
        >
        </div>
    </div>
</section>

<section class="container w-full ">
    <h2 class="text-2xl font-bold py-5">Attendance Records</h2>
    
    <Table.Root>
        <Table.Header>
            <Table.Head>Class Name</Table.Head>
            <Table.Head>Scan Time</Table.Head>
            <Table.Head>Status</Table.Head>
        </Table.Header>
        <Table.Body class="max-h-[1000px] overflow-y-auto">
            {#each student.records as record}
                <Table.Row>
                    <Table.Cell>{record.class.name}</Table.Cell>
                    <Table.Cell>{record.timestamp.toLocaleString()}</Table.Cell>
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
        </Table.Body>
    </Table.Root>
</section>
