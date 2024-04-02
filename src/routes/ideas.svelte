<script lang="ts">
	import { getIdeas } from '$lib/ideas';
	import { type Idea } from '$lib/ideas';

	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Plus from 'svelte-radix/Plus.svelte';
	import Splus from 'lucide-svelte/icons/square-plus';

	let ideas: Idea[];

	async function loadIdeas() {
		ideas = await getIdeas();
		console.log(ideas);
	}

	loadIdeas();
</script>

<div class="ml-16 mt-16">
	<div class="flex items-center mb-4">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Lista delle idee</h1>
		<Button size="icon" class="ml-4">
			<Splus class="h-5 w-5" />
		</Button>
	</div>

	{#if ideas}
		{#each ideas as idea}
			<Card.Root class="w-[250px]">
				<Card.Header>
					<Card.Title>{idea.title}</Card.Title>
					<Card.Description>{idea.description}</Card.Description>
				</Card.Header>
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
