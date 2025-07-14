import { useState, useEffect, useRef } from 'preact/hooks';
import { PROMPT_ENGINEER_INITIAL } from '../../common/AIModels/templates/prompIng.ts';
import { MAIN_ASSISTANT_ORCHESTRATOR } from '../../common/AIModels/templates/assistant.ts';
import { ACTION_AGENT_INITIAL } from '../../common/AIModels/templates/actionsManager.ts';
import { extractActionPrompt } from '../../common/AIModels/utils/parsers.ts';
import { useMailbox } from '../context/hooks/index.tsx';

interface Message {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export const AIChat = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const mailbox = useMailbox();

	useEffect(() => {
		globalThis.Jaime = async (input: string, chatHistory: Message[] = []) => {
			const pulirPrompt = await LanguageModel.create({
				temperature: 1,
				topK: 5,
				initialPrompts: PROMPT_ENGINEER_INITIAL,
			});
			const chat = await LanguageModel.create({
				temperature: 0.1,
				topK: 2,
				initialPrompts: [...MAIN_ASSISTANT_ORCHESTRATOR, ...chatHistory],
			});

			const actionManager = await LanguageModel.create({
				temperature: 0.1,
				topK: 2,
				initialPrompts: ACTION_AGENT_INITIAL,
			});
			const estructured = await pulirPrompt.prompt(input);
			console.log(estructured);
			const response = await chat.prompt(estructured);
			console.log(response);
			const hasAction = extractActionPrompt(response);
			console.log(hasAction);
			if (hasAction) {
				const action = JSON.parse(await actionManager.prompt(response));
				mailbox.request('model_action', action);
			}

			return response;
		};

		setIsConnected(true);
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = async () => {
		if (!inputValue.trim() || isLoading) return;

		const userMessage: Message = {
			role: 'user',
			content: inputValue,
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue('');
		setIsLoading(true);

		const jaime_response = await globalThis.Jaime(inputValue, messages);
		const aiMessage: Message = {
			role: 'assistant',
			content: jaime_response,
		};
		setMessages((prev) => [...prev, aiMessage]);
		setIsLoading(false);
	};

	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSend();
		}
	};

	return (
		<div className="h-full w-full bg-base-200 p-4 flex flex-col">
			{/* Header */}
			<div className="card bg-base-100 shadow-lg mb-4">
				<div className="card-body p-4">
					<h2 className="card-title text-lg mb-2">Jaime</h2>
					<div className="flex items-center gap-2 text-sm opacity-70">
						<div
							className={`w-2 h-2 rounded-full ${
								isConnected ? 'bg-success' : 'bg-error'
							}`}
						></div>
						<span>{isConnected ? 'Connected' : 'Connecting...'}</span>
					</div>
				</div>
			</div>

			{/* Chat Container */}
			<div className="card bg-base-100 shadow-lg flex-1 flex flex-col overflow-hidden">
				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-3">
					{messages.map((message, i) => (
						<div
							key={i}
							className={`flex ${
								message.role === 'user'
									? 'justify-end'
									: message.role === 'system'
									? 'justify-center'
									: 'justify-start'
							}`}
						>
							<div
								className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-2xl text-sm ${
									message.role === 'user'
										? 'bg-primary text-primary-content'
										: message.role === 'assistant'
										? 'bg-base-200 text-base-content'
										: 'bg-warning text-warning-content text-center text-xs'
								}`}
							>
								{message.content}
							</div>
						</div>
					))}

					{isLoading && (
						<div className="flex justify-start">
							<div className="bg-base-200 text-base-content px-4 py-2 rounded-2xl flex items-center gap-2">
								<span className="text-sm">Thinking</span>
								<div className="flex gap-1">
									<div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
									<div
										className="w-1 h-1 bg-current rounded-full animate-bounce"
										style={{ animationDelay: '0.1s' }}
									></div>
									<div
										className="w-1 h-1 bg-current rounded-full animate-bounce"
										style={{ animationDelay: '0.2s' }}
									></div>
								</div>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				{/* Input Container */}
				<div className="border-t border-base-300 p-4">
					<div className="flex gap-2">
						<input
							type="text"
							placeholder="Pregúntame cualquier cosa sobre esta página o dame una tarea..."
							className="input input-bordered flex-1 rounded-full text-sm"
							value={inputValue}
							onInput={(e) =>
								setInputValue((e.target as HTMLInputElement).value)
							}
							onKeyPress={handleKeyPress}
							disabled={isLoading}
						/>
						<button
							type="button"
							className="btn btn-primary rounded-full px-6"
							onClick={handleSend}
							disabled={isLoading || !inputValue.trim()}
						>
							Enviar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
