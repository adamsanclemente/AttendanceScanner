<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Alert from '$lib/components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Loader2 } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { createSchoolSchema } from '$lib/config/zod-schemas';
	export let data: PageData;
	let schools = data.schools;

	const SchoolSchema = createSchoolSchema.pick({
		school_name: true,
		description: true
	});

	type SchoolSchema = typeof SchoolSchema;
	export let form: SuperValidated<SchoolSchema>;
	form = data.form;


</script>

<svelte:head>
	<title>Dashboard | Attendance Scanner</title>
</svelte:head>

<section class="container grid items-center gap-6">
	<div class="flex w-full flex-row justify-between items-center">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">Your Schools</h1>
		<Dialog.Root>
			<Dialog.Trigger>
				<Button>+ Create School</Button>
			</Dialog.Trigger>

			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Create School</Dialog.Title>
					<Dialog.Description>Fill out the form to create a new school</Dialog.Description>
				</Dialog.Header>
				<Form.Root let:submitting let:errors method="POST" {form} schema={createSchoolSchema} let:config>
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
	</div>

	<div class="grid grid-cols-3 gap-4">
		{#each schools as school}
			<Card.Root class="col-span-1">
				<Card.Header>
					<Card.Title>{school.name}</Card.Title>
					<Card.Description>{school.description}</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button variant="default" href={`/school/${school.id}`}>View School</Button>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	{#if schools.length === 0}
		<p class="text-lg text-gray-300 col-span-3">
			You are not part of a school yet. Create one or be invited to one.
		</p>
	{/if}
</section>
