"use client";

import { useState, FormEvent } from "react";

interface ChatInputProps {
	onSubmit: (message: string) => void;
	disabled?: boolean;
}

export default function ChatInput({ onSubmit, disabled }: ChatInputProps) {
	const [input, setInput] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (input.trim() && !disabled) {
			onSubmit(input.trim());
			setInput("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				disabled={disabled}
				placeholder={disabled ? "Procesando..." : "Escribe tu pregunta..."}
				className="flex-1 px-4 py-3 border border-gray-300 rounded-lg 
                   bg-white text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   transition-colors duration-200"
			/>
			<button
				type="submit"
				disabled={disabled || !input.trim()}
				className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                   hover:bg-blue-700 active:bg-blue-800
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors duration-200"
			>
				Enviar
			</button>
		</form>
	);
}
