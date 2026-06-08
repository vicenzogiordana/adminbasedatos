"use client";

import type { ChatMessage as ChatMessageType } from "@/types";
import ChatMessage from "./ChatMessage";

interface ChatHistoryProps {
	messages: ChatMessageType[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
	if (messages.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center text-gray-500">
				<div className="text-center">
					<p className="text-lg font-medium">Sin mensajes</p>
					<p className="text-sm mt-1">
						Ingesta un documento y haz tu primera pregunta
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto space-y-4 p-4">
			{messages.map((message) => (
				<ChatMessage key={message.id} message={message} />
			))}
		</div>
	);
}
