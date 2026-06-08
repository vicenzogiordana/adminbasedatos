// Shared types for RAG system

export interface Chunk {
	text: string;
	source: string;
	chunk_id: number;
}

export interface QueryRequest {
	question: string;
	top_k?: number;
}

export interface QueryResponse {
	answer: string;
	sources: Chunk[];
}

export interface IngestRequest {
	text: string;
	source: string;
}

export interface IngestResponse {
	success: boolean;
	chunks_created: number;
	collection: string;
}

export interface StatusResponse {
	qdrant: boolean;
	ollama: boolean;
	collection_exists: boolean;
}

export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	sources?: Chunk[];
}
