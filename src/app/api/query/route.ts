import { NextRequest, NextResponse } from "next/server";
import { embed, generate, buildRagPrompt } from "@/lib/ollama";
import { searchChunks } from "@/lib/qdrant";
import type { QueryRequest, QueryResponse } from "@/types";

export async function POST(request: NextRequest) {
	try {
		const body: QueryRequest = await request.json();
		const { question, top_k = 5 } = body;

		if (!question) {
			return NextResponse.json({ error: "Missing question" }, { status: 400 });
		}

		// Generate embedding for the question
		const queryVector = await embed(question);

		// Search for similar chunks in Qdrant
		const sources = await searchChunks(queryVector, top_k, 0.7);

		if (sources.length === 0) {
			const response: QueryResponse = {
				answer:
					"No encontré información relevante en los documentos. Por favor, asegúrate de haber ingestado documentos primero.",
				sources: [],
			};
			return NextResponse.json(response);
		}

		// Build context from retrieved chunks
		const context = sources
			.map((chunk, i) => `[${i + 1}] ${chunk.text} (Fuente: ${chunk.source})`)
			.join("\n\n");

		// Build RAG prompt
		const prompt = buildRagPrompt(context, question);

		// Generate response using LLM
		const answer = await generate(prompt);

		const response: QueryResponse = {
			answer,
			sources,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Query error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
