import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {siFormSchema } from "$lib/schema";
 
export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(siFormSchema )),
  };
};
 
export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(siFormSchema ));
    if (!form.valid) {
    console.log('cellaaa');
      return fail(400, {
        form,
      });
    }
    console.log('bellaaa');
    return {
      form,
    };
  },
};


