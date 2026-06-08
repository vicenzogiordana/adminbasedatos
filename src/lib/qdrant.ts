// Qdrant client wrapper using native fetch API

import { v4 as uuidv4 } from "uuid";
import type { Chunk } from "@/types";

const QDRANT_HOST = process.env.QDRANT_HOST || "localhost";
const QDRANT_PORT = parseInt(process.env.QDRANT_PORT || "6333");
const QDRANT_URL = `http://${QDRANT_HOST}:${QDRANT_PORT}`;
const COLLECTION_NAME = "rag_collection";
const VECTOR_SIZE = 768; // nomic-embed-text dimension

async function qdrantRequest<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const response = await fetch(`${QDRANT_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Qdrant error ${response.status}: ${error}`);
	}

	return response.json();
}

/**
 * Initialize the RAG collection with proper configuration
 */
export async function initCollection(): Promise<void> {
	try {
		const collectionsResponse = await qdrantRequest<{
			result: { collections: Array<{ name: string }> };
		}>("/collections");
		const exists = collectionsResponse.result.collections.some(
			(c) => c.name === COLLECTION_NAME,
		);

		if (!exists) {
			await qdrantRequest(`/collections/${COLLECTION_NAME}`, {
				method: "PUT",
				body: JSON.stringify({
					vectors: {
						size: VECTOR_SIZE,
						distance: "Cosine",
					},
					hnsw_config: {
						m: 16,
						ef_construct: 100,
						full_scan_threshold: 10000,
					},
					wal_config: {
						wal_capacity_mb: 32,
						wal_segments_ahead: 0,
					},
					optimizers_config: {
						indexing_threshold: 20000,
						memmap_threshold: 50000,
						flush_interval_sec: 5,
					},
				}),
			});
			console.log(`Collection '${COLLECTION_NAME}' created.`);
		} else {
			console.log(`Collection '${COLLECTION_NAME}' already exists.`);
		}
	} catch (error) {
		console.error("Init collection error:", error);
		throw error;
	}
}

/**
 * Insert chunks with their embeddings into Qdrant
 */
export async function insertChunks(
	chunks: Chunk[],
	embeddings: number[][],
): Promise<{ inserted: number }> {
	const points = chunks.map((chunk, index) => ({
		id: uuidv4(),
		vector: embeddings[index],
		payload: {
			text: chunk.text,
			source: chunk.source,
			chunk_id: chunk.chunk_id,
		},
	}));

	await qdrantRequest(`/collections/${COLLECTION_NAME}/points`, {
		method: "PUT",
		body: JSON.stringify({
			wait: true,
			points,
		}),
	});

	return { inserted: points.length };
}

/**
 * Search for similar chunks using cosine similarity
 */
export async function searchChunks(
	queryVector: number[],
	limit: number = 5,
	scoreThreshold: number = 0.7,
): Promise<Chunk[]> {
	const result = await qdrantRequest<{
		result: Array<{
			id: string;
			score: number;
			payload?: Record<string, unknown>;
		}>;
	}>(`/collections/${COLLECTION_NAME}/points/search`, {
		method: "POST",
		body: JSON.stringify({
			vector: queryVector,
			limit,
			score_threshold: scoreThreshold,
			with_payload: true,
		}),
	});

	return result.result.map((r) => ({
		text: (r.payload?.text as string) || "",
		source: (r.payload?.source as string) || "",
		chunk_id: (r.payload?.chunk_id as number) || 0,
	}));
}

/**
 * Check if Qdrant is healthy
 */
export async function checkQdrantHealth(): Promise<boolean> {
	try {
		const response = await fetch(`${QDRANT_URL}/collections`, {
			method: "GET",
			signal: AbortSignal.timeout(3000),
		});
		return response.ok;
	} catch {
		return false;
	}
}

/**
 * Check if collection exists
 */
export async function collectionExists(): Promise<boolean> {
	try {
		const collectionsResponse = await qdrantRequest<{
			result: { collections: Array<{ name: string }> };
		}>("/collections");
		return collectionsResponse.result.collections.some(
			(c) => c.name === COLLECTION_NAME,
		);
	} catch {
		return false;
	}
}

export { COLLECTION_NAME, VECTOR_SIZE };
