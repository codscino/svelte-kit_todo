import { ID, Query } from 'appwrite';
import { databases } from '$lib/appwrite';
import { type Models } from 'appwrite';

const IDEAS_DATABASE_ID = '65cf31c6e1c4edddc2a3'; // Replace with your database ID
const IDEAS_COLLECTION_ID = 'ideas-tracker'; // Replace with your collection ID

export interface Idea extends Models.Document {
	userId: string;
	title: string;
	description: string;
}

export async function getIdeas() {
	const response = await databases.listDocuments(
		IDEAS_DATABASE_ID,
		IDEAS_COLLECTION_ID,
		// Use a query to show the latest ideas first
		[Query.orderDesc('$createdAt')]
	);
    //console.log(response.documents as Idea[]);
    return response.documents as Idea[];
}

