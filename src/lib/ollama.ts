// Ollama API client for embeddings and LLM generation

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
const LLM_MODEL = process.env.OLLAMA_LLM_MODEL || "llama3";

export interface EmbedResult {
	embedding: number[];
}

export interface GenerateResult {
	response: string;
	done: boolean;
}

/**
 * Generate embedding for text using Ollama
 */
export async function embed(text: string): Promise<number[]> {
	try {
		const res = await fetch(`${OLLAMA_HOST}/api/embeddings`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: EMBED_MODEL,
				prompt: text,
			}),
		});

		if (!res.ok) {
			throw new Error(`Ollama embed error: ${res.status} ${res.statusText}`);
		}

		const data: EmbedResult = await res.json();
		return data.embedding;
	} catch (error) {
		console.error("Embed error:", error);
		throw error;
	}
}

/**
 * Generate response using LLM with context
 */
export async function generate(prompt: string): Promise<string> {
	try {
		const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: LLM_MODEL,
				prompt,
				stream: false,
			}),
		});

		if (!res.ok) {
			throw new Error(`Ollama generate error: ${res.status} ${res.statusText}`);
		}

		const data: GenerateResult = await res.json();
		return data.response;
	} catch (error) {
		console.error("Generate error:", error);
		throw error;
	}
}

/**
 * Build RAG prompt with context and question
 */
export function buildRagPrompt(context: string, question: string): string {
	return `Eres un asistente que responde preguntas basadas en el contexto proporcionado.

Contexto:
${context}

Pregunta: ${question}

Responde de manera clara y precisa usando únicamente la información del contexto. Si no tienes suficiente información para responder, indícalo.`;
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaHealth(): Promise<boolean> {
	try {
		const res = await fetch(`${OLLAMA_HOST}/api/tags`, { method: "GET" });
		return res.ok;
	} catch {
		return false;
	}
}
