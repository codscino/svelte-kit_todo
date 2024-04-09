<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { siFormSchema , type FormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { loggedInUser } from '$lib/store';
	import { account, ID } from '$lib/appwrite';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(siFormSchema),
		onSubmit: async ({ formData, submitter }) => {
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;

			const type = submitter?.dataset.type;

			if (type === 'login') {
				await login(email, password);
			} else if (type === 'register') {
				await register(email, password);
			}
		}
	});

	const { form: formData, enhance } = form;

	async function login(email: string, password: string) {
		await account.createEmailSession(email, password);
		loggedInUser.set(await account.get()); // update the store
		console.log('logged');
	}

	async function register(email: string, password: string) {
		await account.create(ID.unique(), email, password);
		login(email, password);
	}

	async function logout() {
		await account.deleteSession('current');
		loggedInUser.set(null);
	}

	let showHelloWorld = false;

	function handleClick() {
		showHelloWorld = !showHelloWorld;
	}
</script>

{#if showHelloWorld}
<Card.Root class="max-w-sm">
    <Card.Header>
        <Card.Title class="text-2xl">Sign Up</Card.Title>
        <Card.Description>Enter your information to create an account</Card.Description>
    </Card.Header>
    <Card.Content>
        <form method="POST" use:enhance>

            <Form.Button type="submit" data-type="login" class="mt-8">Create an account</Form.Button>

            <div class="mt-4 text-sm">
                Already have an account?
                <button on:click={handleClick} class="text-balck-500 underline focus:outline-none">
                    Sign in
                </button>
            </div>
        </form>
    </Card.Content>
</Card.Root>
{:else}
	<Card.Root class="max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your email below to login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance>
				<Form.Field class="" {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input
							type="email"
							placeholder="johndoe@icloud.com"
							required
							{...attrs}
							bind:value={$formData.email}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field class="mt-4" {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input
							type="password"
							placeholder="••••••••••"
							required
							{...attrs}
							bind:value={$formData.password}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button type="submit" data-type="login" class="mt-8">Login</Form.Button>

				<div class="mt-4 text-sm">
					Don&apos;t have an account?
					<button on:click={handleClick} class="text-balck-500 underline focus:outline-none">
						Sign up
					</button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
{/if}
