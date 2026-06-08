"use client";

import { useState, FormEvent } from "react";

interface DocumentUploaderProps {
	onIngest: (text: string, source: string) => Promise<void>;
	disabled?: boolean;
}

export default function DocumentUploader({
	onIngest,
	disabled,
}: DocumentUploaderProps) {
	const [fileName, setFileName] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [textContent, setTextContent] = useState("");

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setFileName(file.name);
		setResult(null);

		try {
			const text = await file.text();
			setTextContent(text);
		} catch (error) {
			setResult(`Error al leer archivo: ${error}`);
		}
	};

	const handleIngest = async (e: FormEvent) => {
		e.preventDefault();
		if (!textContent.trim()) {
			setResult("Ingresa texto para ingestar");
			return;
		}

		setLoading(true);
		setResult(null);

		try {
			const source = fileName || "texto-ingresado";
			await onIngest(textContent, source);
			setResult(`✓ Documento ingestado exitosamente`);
			setTextContent("");
			setFileName(null);
		} catch (error) {
			setResult(`Error: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleIngest}
			className="bg-white border border-gray-200 rounded-lg p-4"
		>
			<h3 className="font-medium text-gray-900 mb-3">Ingestar Documento</h3>

			<div className="mb-3">
				<label className="block text-sm text-gray-700 mb-1">
					Archivo (opcional)
				</label>
				<input
					type="file"
					accept=".txt,.md,.text"
					onChange={handleFileChange}
					disabled={disabled || loading}
					className="block w-full text-sm text-gray-700
                     file:mr-3 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-medium
                     file:bg-gray-100 file:text-gray-700
                     hover:file:bg-gray-200
                     disabled:opacity-50"
				/>
			</div>

			<textarea
				value={textContent}
				onChange={(e) => setTextContent(e.target.value)}
				placeholder="Pega o escribe el texto del documento aquí..."
				rows={6}
				disabled={loading}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                   bg-white text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:bg-gray-100 resize-none"
			/>

			<div className="flex items-center justify-between mt-3">
				<button
					type="submit"
					disabled={disabled || loading || !textContent.trim()}
					className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg
                     hover:bg-green-700 active:bg-green-800
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200"
				>
					{loading ? "Ingestando..." : "Ingestar"}
				</button>

				{result && (
					<p
						className={`text-sm ${result.startsWith("✓") ? "text-green-600" : "text-red-600"}`}
					>
						{result}
					</p>
				)}
			</div>
		</form>
	);
}
