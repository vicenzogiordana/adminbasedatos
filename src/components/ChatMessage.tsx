"use client";

import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
	message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.role === "user";

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-[80%] rounded-lg px-4 py-3 ${
					isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
				}`}
			>
				<p className="whitespace-pre-wrap break-words">{message.content}</p>

				{message.sources && message.sources.length > 0 && !isUser && (
					<details className="mt-3 pt-3 border-t border-gray-200">
						<summary className="text-sm font-medium cursor-pointer text-gray-600 hover:text-gray-800">
							Fuentes ({message.sources.length})
						</summary>
						<div className="mt-2 space-y-2">
							{message.sources.map((source, i) => (
								<div
									key={i}
									className="text-sm bg-white p-2 rounded border border-gray-200"
								>
									<span className="font-medium text-gray-700">
										[{i + 1}] {source.source} (chunk #{source.chunk_id})
									</span>
									<p className="text-gray-600 mt-1 line-clamp-2">
										{source.text}
									</p>
								</div>
							))}
						</div>
					</details>
				)}
			</div>
		</div>
	);
}
