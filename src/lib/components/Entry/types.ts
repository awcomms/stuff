import type {
	Id,
	// Embedding
} from '$lib/types';

export interface Journal {
	// id: Id;
	name: string;
	entries: Id;
}

export interface Entry {
	id: Id;
	name: string;
	text: string;
	// embedding: Embedding;
	date: Date;
	entries: Id;
}
