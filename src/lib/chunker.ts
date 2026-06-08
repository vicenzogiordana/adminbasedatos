// Text chunking utilities for RAG ingestion
// Approximates token-based chunking (4 chars ≈ 1 token)

export interface ChunkOptions {
	chunkSize?: number; // Target tokens per chunk (default: 512)
	overlap?: number; // Overlapping tokens between chunks (default: 50)
}

const DEFAULT_CHUNK_SIZE = 512;
const DEFAULT_OVERLAP = 50;
const CHARS_PER_TOKEN = 4;

export function chunkText(text: string, options: ChunkOptions = {}): string[] {
	const { chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP } = options;

	if (!text || text.trim().length === 0) {
		return [];
	}

	const tokensPerChunk = chunkSize;
	const overlapTokens = overlap;
	const charsPerChunk = tokensPerChunk * CHARS_PER_TOKEN;
	const step = (tokensPerChunk - overlapTokens) * CHARS_PER_TOKEN;

	const chunks: string[] = [];

	// Split by sentences first for better context preservation
	const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
	let currentChunk = "";

	for (const sentence of sentences) {
		// If adding this sentence exceeds chunk size, save current and start new
		if (
			currentChunk.length + sentence.length > charsPerChunk &&
			currentChunk.length > 0
		) {
			chunks.push(currentChunk.trim());
			// Keep overlap from end of previous chunk
			const overlapText = currentChunk.slice(-step);
			currentChunk = overlapText + sentence;
		} else {
			currentChunk += sentence;
		}
	}

	// Add final chunk
	if (currentChunk.trim().length > 0) {
		chunks.push(currentChunk.trim());
	}

	return chunks;
}

export function chunkWithMetadata(
	text: string,
	source: string,
): Array<{
	text: string;
	source: string;
	chunk_id: number;
}> {
	const chunks = chunkText(text);
	return chunks.map((text, index) => ({
		text,
		source,
		chunk_id: index,
	}));
}
