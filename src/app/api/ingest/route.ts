import { NextRequest, NextResponse } from "next/server";
import { embed } from "@/lib/ollama";
import { initCollection, insertChunks } from "@/lib/qdrant";
import { chunkWithMetadata } from "@/lib/chunker";
import type { IngestRequest, IngestResponse } from "@/types";

export async function POST(request: NextRequest) {
	try {
		const body: IngestRequest = await request.json();
		const { text, source } = body;

		if (!text || !source) {
			return NextResponse.json(
				{ success: false, error: "Missing text or source" },
				{ status: 400 },
			);
		}

		// Initialize collection if needed
		await initCollection();

		// Chunk the text
		const chunks = chunkWithMetadata(text, source);

		// Generate embeddings for each chunk
		const embeddings = await Promise.all(
			chunks.map((chunk) => embed(chunk.text)),
		);

		// Insert into Qdrant
		const result = await insertChunks(chunks, embeddings);

		const response: IngestResponse = {
			success: true,
			chunks_created: result.inserted,
			collection: "rag_collection",
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Ingest error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}
