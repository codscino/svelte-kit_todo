import { ID, Query } from 'appwrite';
import { databases } from '$lib/appwrite';

const IDEAS_DATABASE_ID = '65cf31c6e1c4edddc2a3'; // Replace with your database ID
const IDEAS_COLLECTION_ID = 'ideas-tracker'; // Replace with your collection ID

export async function getIdeas() {
	return await databases.listDocuments(
		IDEAS_DATABASE_ID,
		IDEAS_COLLECTION_ID,
		// Use a query to show the latest ideas first
		[Query.orderDesc('$createdAt')]
	);
}

export async function addIdea(userId, title, description) {
	await databases.createDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, ID.unique(), {
		userId,
		title,
		description
	});
}

export async function deleteIdea(id) {
	await databases.deleteDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
}
