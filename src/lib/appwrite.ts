import { Client, Account, Databases } from 'appwrite';
// Import type models for Appwrite

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65cf310b2b326e1c5f3a'); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export { ID } from 'appwrite';

