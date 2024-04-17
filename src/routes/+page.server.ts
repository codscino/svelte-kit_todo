import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { siFormSchema, suFormSchema } from '$lib/schema';

export const load: PageServerLoad = async () => {
	return {
		siform: await superValidate(zod(siFormSchema)),
		suform: await superValidate(zod(suFormSchema))
	};
};

export const actions: Actions = {
	login: async (event) => {
		const siform = await superValidate(event, zod(siFormSchema));
		if (!siform.valid) {
			console.log('cellaaa');
			return fail(400, {
				siform
			});
		}
		console.log('bellaaa');
		return {
			siform
		};
	},

	register: async (event) => {
		const suform = await superValidate(event, zod(suFormSchema));
		if (!suform.valid) {
			console.log('cellaaa');
			return fail(400, {
				suform
			});
		}
		console.log('bellaaa');
		return {
			suform
		};
	}
};
