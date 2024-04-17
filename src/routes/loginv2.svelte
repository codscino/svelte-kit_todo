<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { siFormSchema, type iFormSchema } from '$lib/schema';
	import { suFormSchema, type uFormSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { loggedInUser } from '$lib/store';
	import { account, ID } from '$lib/appwrite';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let loginError: string | null = null;
	let registerError: string | null = null;

	export let sidata: SuperValidated<Infer<iFormSchema>>;
	export let sudata: SuperValidated<Infer<uFormSchema>>;

	const siform = superForm(sidata, {
		validators: zodClient(siFormSchema),
		onSubmit: async ({ formData, submitter }) => {
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;

			const type = submitter?.dataset.type;
			await login(email, password);
			console.log('logged');
		}
	});

	const suform = superForm(sudata, {
		validators: zodClient(suFormSchema),
		onSubmit: async ({ formData, submitter }) => {
			const name = formData.get('name') as string;
			const surname = formData.get('surname') as string;
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;

			const type = submitter?.dataset.type;
			await register(email, password, name, surname);
		}
	});

	const { form: formData, enhance } = siform;
	const { form: suFormData, enhance: suEnhance } = suform;

	async function login(email: string, password: string) {
		try {
			await account.createEmailSession(email, password);
			loggedInUser.set(await account.get()); // update the store
			loginError = null; // clear the error message upon successful login
		} catch (error) {
			loginError = (error as Error).message; // set the error message if login fails
		}
	}

	async function register(email: string, password: string, name: string, surname: string) {
		try {
			await account.create(ID.unique(), email, password, name + ' ' + surname);
		} catch (error) {
			console.error(error);
			registerError = (error as Error).message; // set the error message if registration fails
		}
		login(email, password);
	}

	async function logout() {
		await account.deleteSession('current');
		loggedInUser.set(null);
	}

	let isSignUp = false;

	function handleClick() {
		isSignUp = !isSignUp;
	}
</script>

{#if $loggedInUser}
	<div class="">
		<div class="mb-8 mt-8 text-lg font-semibold">
			<div class="mb-8 mt-8 text-lg font-semibold">
				Benvenuto egregissimo<br /><span class="font-normal">{$loggedInUser.name}</span>
			</div>
		</div>

		<form on:submit={logout}>
			<Button type="submit" variant="destructive">Logout</Button>
		</form>
	</div>
{:else if isSignUp}
	<Card.Root class="max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Sign Up</Card.Title>
			<Card.Description>Enter your information to create an account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" action="?/register" use:suEnhance>
				<Form.Field class="mt-4" form={suform} name="name">
					<Form.Control let:attrs>
						<Form.Label>Nome</Form.Label>
						<Input
							type="text"
							placeholder="John"
							required
							{...attrs}
							bind:value={$suFormData.name}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field class="mt-4" form={suform} name="surname">
					<Form.Control let:attrs>
						<Form.Label>Cognome</Form.Label>
						<Input
							type="text"
							placeholder="Doe"
							required
							{...attrs}
							bind:value={$suFormData.surname}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field class="mt-4" form={suform} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input
							type="email"
							placeholder="johndoe@icloud.com"
							required
							{...attrs}
							bind:value={$suFormData.email}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field class="mt-4" form={suform} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input
							type="password"
							placeholder="••••••••••"
							required
							{...attrs}
							bind:value={$suFormData.password}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button type="submit" class="mt-8">Create an account</Form.Button>
				{#if registerError}
					<div class="mt-4 text-red-500">{registerError}</div>
				{/if}

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
			<form method="POST" action="?/login" use:enhance>
				<Form.Field class="" form={siform} name="email">
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

				<Form.Field class="mt-4" form={siform} name="password">
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

				<Form.Button type="submit" class="mt-8">Login</Form.Button>
				<!-- Display the error message if it exists -->
				{#if loginError}
					<div class="mt-4 text-red-500">{loginError}</div>
				{/if}

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
