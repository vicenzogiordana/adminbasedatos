"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "@/components/ChatInput";
import ChatHistory from "@/components/ChatHistory";
import DocumentUploader from "@/components/DocumentUploader";
import type { ChatMessage } from "@/types";

export default function Home() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [status, setStatus] = useState<{
		qdrant: boolean;
		ollama: boolean;
		collection_exists: boolean;
	} | null>(null);
	const [showUploader, setShowUploader] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const checkStatus = async () => {
		try {
			const res = await fetch("/api/status");
			const data = await res.json();
			setStatus(data);
		} catch {
			setStatus({ qdrant: false, ollama: false, collection_exists: false });
		}
	};

	// Check service status on mount
	useEffect(() => {
		const doCheck = async () => {
			try {
				const res = await fetch("/api/status");
				const data = await res.json();
				setStatus(data);
			} catch {
				setStatus({ qdrant: false, ollama: false, collection_exists: false });
			}
		};
		doCheck();
	}, []);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleIngest = async (text: string, source: string) => {
		setIsProcessing(true);
		try {
			await fetch("/api/ingest", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text, source }),
			});
			await checkStatus();
		} finally {
			setIsProcessing(false);
		}
	};

	const handleQuery = async (question: string) => {
		// Add user message
		const userMessage: ChatMessage = {
			id: uuidv4(),
			role: "user",
			content: question,
		};
		setMessages((prev) => [...prev, userMessage]);
		setIsProcessing(true);

		try {
			const res = await fetch("/api/query", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question, top_k: 5 }),
			});

			const data = await res.json();

			// Add assistant message
			const assistantMessage: ChatMessage = {
				id: uuidv4(),
				role: "assistant",
				content: data.answer || data.error || "Error al procesar la consulta",
				sources: data.sources || [],
			};
			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			const errorMessage: ChatMessage = {
				id: uuidv4(),
				role: "assistant",
				content: `Error: ${error}`,
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
					<div>
						<h1 className="text-xl font-semibold text-gray-900">RAG System</h1>
						<p className="text-sm text-gray-500">Qdrant + Ollama</p>
					</div>

					{/* Status indicators */}
					<div className="flex items-center gap-3 text-sm">
						<StatusBadge label="Qdrant" active={status?.qdrant ?? false} />
						<StatusBadge label="Ollama" active={status?.ollama ?? false} />
						<StatusBadge
							label="Colección"
							active={status?.collection_exists ?? false}
						/>
						<button
							onClick={checkStatus}
							className="ml-2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
						>
							↻
						</button>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="max-w-4xl mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Chat section */}
					<div className="lg:col-span-2">
						<div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[600px]">
							{/* Chat header */}
							<div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
								<h2 className="font-medium text-gray-900">Chat RAG</h2>
							</div>

							{/* Messages */}
							<ChatHistory messages={messages} />
							<div ref={messagesEndRef} />

							{/* Input */}
							<div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
								<ChatInput
									onSubmit={handleQuery}
									disabled={isProcessing || !status?.qdrant}
								/>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-4">
						{/* Toggle uploader */}
						<button
							onClick={() => setShowUploader(!showUploader)}
							className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg
                         hover:bg-gray-200 transition-colors text-left flex items-center justify-between"
						>
							<span>📄 {showUploader ? "Ocultar" : "Ingestar documento"}</span>
							<span>{showUploader ? "▲" : "▼"}</span>
						</button>

						{showUploader && (
							<DocumentUploader
								onIngest={handleIngest}
								disabled={isProcessing || !status?.qdrant}
							/>
						)}

						{/* Info card */}
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<h3 className="font-medium text-gray-900 mb-2">Cómo usar</h3>
							<ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
								<li>Asegúrate que Qdrant y Ollama estén corriendo</li>
								<li>Ingesta un documento usando el panel lateral</li>
								<li>Haz preguntas sobre el contenido</li>
								<li>El sistema usará búsqueda vectorial + LLM</li>
							</ol>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
	return (
		<span
			className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
				active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
			}`}
		>
			<span
				className={`w-2 h-2 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`}
			/>
			{label}
		</span>
	);
}
