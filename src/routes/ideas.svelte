<script lang="ts">
	import { getIdeas, delIdea, addIdea, updateIdea } from '$lib/ideas';
	import { type Idea, type basicIdea } from '$lib/ideas';

	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Splus from 'lucide-svelte/icons/square-plus';
	import TrashIcon from 'lucide-svelte/icons/trash';
	import SpenIcon from 'lucide-svelte/icons/square-pen';
	import CardContent from '$lib/components/ui/card/card-content.svelte';

	import { writable } from 'svelte/store';
	import { loggedInUser } from '$lib/store'; // import the store

	let ideas = writable<Idea[]>([]);

	async function loadIdeas() {
		ideas.set(await getIdeas());
		console.log($ideas);
	}

	async function handleDelete(idea: Idea) {
		delIdea(idea['$id']);
		ideas.update((currentIdeas) => {
			return currentIdeas.filter((currentIdea) => currentIdea.$id !== idea.$id);
		});
		console.log($ideas);
	}

	async function handleAdd(basicIdea: basicIdea) {
		const newIdea = await addIdea(basicIdea);
		isDialogOpen1 = false;
		await new Promise((resolve) => setTimeout(resolve, 500)); //delay 0,5s
		ideas.update((currentIdeas) => [newIdea as Idea, ...currentIdeas]);
		console.log($ideas);
	}

	async function handleUpdate(idea: Idea) {
		const newIdea = await updateIdea(idea);
		isDialogOpen2 = false;
		await new Promise((resolve) => setTimeout(resolve, 500)); //delay 0,5s
		if (newIdea) {
			ideas.update((currentIdeas) => {
				const index = currentIdeas.findIndex((currentIdea) => currentIdea.id === newIdea.id);
				if (index !== -1) {
					currentIdeas.splice(index, 1, newIdea);
				}
				return currentIdeas;
			});
		}
		console.log($ideas);
	}

	loadIdeas();

	let isDialogOpen1: boolean = false;
	let isDialogOpen2: boolean = false;
	let title: string = 'Idea geniale';
	let description: string | null = 'Scrivi qui la tua descrizione';

	let selectedIdea: Idea | null = null;
</script>

{#if $loggedInUser !== null}
	<div class="ml-16 mt-16">
		<div class="mb-4 flex items-center">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Lista delle idee
			</h1>

			<Dialog.Root bind:open={isDialogOpen1}>
				<Dialog.Trigger
					class={buttonVariants({ variant: 'outline', size: 'icon', class: 'ml-4' })}
					on:click={() => (isDialogOpen1 = true)}
				>
					<Splus class="h-5 w-5" />
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Aggiungi Idea</Dialog.Title>
						<Dialog.Description>Aggiungi quel cabbo che ti viene in mente</Dialog.Description>
					</Dialog.Header>
					<div class="grid gap-4 py-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="title" class="text-right">Titolo</Label>
							<Input id="title" bind:value={title} class="col-span-3" />
						</div>
						<div class="grid grid-cols-4 items-start gap-4">
							<Label for="description" class="text-right">Descrizione</Label>
							<Textarea id="description" bind:value={description} class="col-span-3" />
						</div>
					</div>
					<Dialog.Footer>
						<Button
							type="submit"
							on:click={() =>
								handleAdd({
									userId: 'dummyuserid',
									title: title,
									description: description
								})}>Aggiungi</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>

		{#if $ideas.length > 0}
			{#each $ideas as idea}
				<Card.Root class="relative mb-4 w-[250px]">
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder>
							<Button
								variant="ghost"
								size="icon"
								class="absolute right-0 top-0 m-2 rounded-lg"
								aria-label="Delete idea"
								on:click={() => handleDelete(idea)}
								builders={[builder]}
							>
								<TrashIcon class="h-5 w-5" />
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content side="right" sideOffset={5}>Elimina idea</Tooltip.Content>
					</Tooltip.Root>

					<Dialog.Root bind:open={isDialogOpen2}>
						<Dialog.Trigger
							class={buttonVariants({
								variant: 'ghost',
								size: 'icon',
								class: 'absolute right-2 top-8 ml-4 rounded-lg'
							})}
							on:click={() => {
								isDialogOpen2 = true;
								selectedIdea = idea;
							}}
						>
							<SpenIcon class="h-4 w-4" />
						</Dialog.Trigger>
						<Dialog.Content class="sm:max-w-[425px]">
							<Dialog.Header>
								<Dialog.Title>Modifica Idea</Dialog.Title>
								<Dialog.Description>modifica quel cabbo che vuoi</Dialog.Description>
							</Dialog.Header>
							{#if selectedIdea}
								{console.log(selectedIdea)}
								<div class="grid gap-4 py-4">
									<div class="grid grid-cols-4 items-center gap-4">
										<Label for="title" class="text-right">Titolo</Label>
										<Input id="title" bind:value={selectedIdea.title} class="col-span-3" />
									</div>
									<div class="grid grid-cols-4 items-start gap-4">
										<Label for="description" class="text-right">Descrizione</Label>
										<Textarea
											id="description"
											bind:value={selectedIdea.description}
											class="col-span-3"
										/>
									</div>
								</div>
							{:else}
								{console.log('selectedIdea is null', selectedIdea)}
							{/if}
							<Dialog.Footer>
								<Button
									type="submit"
									on:click={() => {
										if (selectedIdea !== null) {
											handleUpdate(selectedIdea);
										}
									}}>Modifica</Button
								>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>

					<Card.Header>
						<Card.Title>{idea.title}</Card.Title>
					</Card.Header>
					<CardContent>
						{idea.description}
					</CardContent>
				</Card.Root>
			{/each}
		{:else}
			<div class="flex items-center space-x-4">
				<Skeleton class="h-12 w-12 rounded-full" />
				<div class="space-y-2">
					<Skeleton class="h-4 w-[250px]" />
					<Skeleton class="h-4 w-[200px]" />
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="ml-16 mt-16">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Lista delle idee</h1>
		{#if $ideas.length > 0}
			{#each $ideas as idea}
				<Card.Root class="relative mb-4 w-[250px] mt-4">
					<Card.Header>
						<Card.Title>{idea.title}</Card.Title>
					</Card.Header>
					<CardContent>
						{idea.description}
					</CardContent>
				</Card.Root>
			{/each}
		{:else}
			<div class="flex items-center space-x-4">
				<Skeleton class="h-12 w-12 rounded-full" />
				<div class="space-y-2">
					<Skeleton class="h-4 w-[250px]" />
					<Skeleton class="h-4 w-[200px]" />
				</div>
			</div>
		{/if}
	</div>
{/if}
