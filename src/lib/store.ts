import { writable } from 'svelte/store';
import { type Models } from 'appwrite';

export const loggedInUser = writable<Models.Preferences | null>(null);