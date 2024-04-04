<script lang="ts">
	import { account, ID } from '$lib/appwrite';
	import { type Models } from 'appwrite';
    import { Button } from "$lib/components/ui/button/index.js";
	import { loggedInUser } from '$lib/store'; // import the store
	
	//let loggedInUser: Models.Preferences | null = null;

	async function login(email: string, password: string) {
        await account.createEmailSession(email, password);
        loggedInUser.set(await account.get()); // update the store
        console.log('logged');
    }

	async function register(email: string, password: string) {
		await account.create(ID.unique(), email, password);
		login(email, password);
	}

	function submit(e: any) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const type = e.submitter.dataset.type;

		if (type === 'login') {
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;
			login(email, password);
		} else if (type === 'register') {
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;
			register(email, password);
		}
	}

	async function logout() {
		await account.deleteSession('current');
		loggedInUser.set(null);
	}
</script>

<div class="absolute right-0 mr-32 mt-16 ">
    
    <form on:submit={submit}>
        <input type="email" placeholder="Email" name="email" required />
        <input type="password" placeholder="Password" name="password" required />
    
        <Button type="submit" data-type="login" variant="outline">Login</Button>
        <Button type="submit" data-type="register" variant="outline">Register</Button>
    </form>
    
    <Button on:click={logout} variant="destructive" class="mt-8">
        Logout
    </Button>

	<div class="text-lg font-semibold mt-8" >
		{$loggedInUser ? `Sei loggato come:  ${$loggedInUser.name}` : 'Non sei loggato'}
	</div>

</div>
