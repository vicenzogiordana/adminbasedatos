import { NextResponse } from "next/server";
import { checkOllamaHealth } from "@/lib/ollama";
import { checkQdrantHealth, collectionExists } from "@/lib/qdrant";
import type { StatusResponse } from "@/types";

export async function GET() {
	try {
		const [qdrantOk, ollamaOk, collectionOk] = await Promise.all([
			checkQdrantHealth(),
			checkOllamaHealth(),
			collectionExists(),
		]);

		const status: StatusResponse = {
			qdrant: qdrantOk,
			ollama: ollamaOk,
			collection_exists: collectionOk,
		};

		const allHealthy = qdrantOk && ollamaOk;

		return NextResponse.json(status, {
			status: allHealthy ? 200 : 503,
		});
	} catch (error) {
		return NextResponse.json(
			{
				qdrant: false,
				ollama: false,
				collection_exists: false,
				error: String(error),
			},
			{ status: 500 },
		);
	}
}
