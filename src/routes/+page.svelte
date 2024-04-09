<script lang="ts">
	import Login from './login.svelte';
	import Ideas from './ideas.svelte';

	import type { PageData } from './$types.js';
	import SettingsForm from './settings-form.svelte';
	export let data: PageData;
</script>

<div class="flex">
	<div class="w-1/2 h-1/3">
		<Ideas />
	</div>
	<div class="w-1/2 h-1/3">
        <div class="h-1/4">
            <Login />
        </div>
        <div class="h-1/4 mt-72">
            <SettingsForm data={data.form} />
        </div>
    </div>
</div>
