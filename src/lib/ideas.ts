import { ID, Query } from 'appwrite';
import { databases } from '$lib/appwrite';
import { type Models } from 'appwrite';

const IDEAS_DATABASE_ID = '65cf31c6e1c4edddc2a3'; // Replace with your database ID
const IDEAS_COLLECTION_ID = 'ideas-tracker'; // Replace with your collection ID

export interface Idea extends Models.Document {
	userId: string;
	title: string;
	description: string | null;
}

export interface basicIdea {
	userId: string;
	title: string;
	description: string | null;
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

export async function delIdea(id: string) {
	try {
		await databases.deleteDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
		console.log('Idea deleted');
	} catch (error) {
		console.error(error);
	}
}

export async function addIdea(idea: basicIdea) {
	try {
		const response = await databases.createDocument(
			IDEAS_DATABASE_ID,
			IDEAS_COLLECTION_ID,
			ID.unique(),
			idea
		);
		console.log('Idea created');
		return response as Idea;
	} catch (error) {
		console.error(error);
	}
}

export async function updateIdea(idea: Idea) {
    try {
        const { $id, $permissions, $databaseId, $collectionId, $createdAt, $updatedAt, ...ideaData } = idea;
        const response = await databases.updateDocument(
            IDEAS_DATABASE_ID,
            IDEAS_COLLECTION_ID,
            $id,
            ideaData,
            $permissions
        );
        console.log('Idea updated');
        return response as Idea;
    } catch (error) {
        console.error(error);
    }
}
