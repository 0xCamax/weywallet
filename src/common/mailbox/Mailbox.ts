import { Message } from './Message.ts';
import {
	SourceType,
	RuntimeMessage,
	RuntimeResponse,
	PendingRequest,
} from './utils/types.ts';

export class Mailbox extends Message {
	public pending: Map<string, PendingRequest>;
	private handlers: Map<
		string,
		(
			payload: any,
			sender: chrome.runtime.MessageSender | MessageEvent,
			sendResponse?: (response: RuntimeResponse) => void
		) => any
	>;

	constructor(source: SourceType) {
		super(source);
		this.source = source;
		this.pending = new Map();
		this.handlers = new Map();

		globalThis.addEventListener(
			'message',
			this._onglobalThisMessage.bind(this)
		);

		if (
			source === 'CONTENT SCRIPT' ||
			source === 'BACKGROUND' ||
			source === 'EXTENSION'
		) {
			chrome.runtime.onMessage.addListener(
				(
					message: RuntimeMessage,
					sender: chrome.runtime.MessageSender,
					sendResponse: (response: RuntimeResponse) => void
				) => {
					return this._onRuntimeMessage(message, sender, sendResponse);
				}
			);
		}
	}

	/**
	 * Handler para mensajes entre ventanas (DOM <-> CS)
	 */
	private _onglobalThisMessage(event: MessageEvent): void {
		if (event.data.source === this.source || !event.data?.__mailbox__) return;

		this.log(event);

		const { source, type, payload, dest, requestId } = event.data;
		const { data } = payload;

		if (source === this.source || dest !== this.source) return;

		if (type?.startsWith('RESPONSE_') && this.pending.has(requestId)) {
			const pendingRequest = this.pending.get(requestId);
			if (pendingRequest) {
				pendingRequest.resolve(data);
				this.pending.delete(requestId);
			}
			return;
		}

		if (type?.startsWith('REQUEST_')) {
			const requestType = type.replace('REQUEST_', '');
			const handler = this.handlers.get(requestType);

			if (!handler) {
				this.log(`No handler for request: ${requestType}`);
				return;
			}

			Promise.resolve(handler(payload, event)).then((responsePayload) => {
				this.send(`RESPONSE_${type}`, responsePayload, 'DOM', '*', {
					requestId,
				});
			});
		}

		if (type?.startsWith('NOTIFY_')) {
			const event = type.replace('NOTIFY_', '');
			const handler = this.handlers.get(event);
			if (!handler) {
				this.log('No handler for this');
				return;
			}
			handler(payload, event);
		}
	}

	/**
	 * Handler para mensajes de runtime (CS <-> BG)
	 */
	private _onRuntimeMessage(
		message: RuntimeMessage,
		sender: chrome.runtime.MessageSender,
		sendResponse: (response: RuntimeResponse) => void
	): boolean {
		if (!message?.__mailbox__ || message.dest !== this.source) {
			this.log('Ignored runtime message');
			return false;
		}
		const { type, requestId, payload } = message;

		if (type?.startsWith('REQUEST_')) {
			const requestType = type.replace('REQUEST_', '');
			const handler = this.handlers.get(requestType);

			if (!handler) {
				sendResponse({ ok: false, error: `No handler for ${requestType}` });
				return false;
			}

			try {
				const result = handler(payload, sender, sendResponse);

				if (result && typeof result.then === 'function') {
					result
						.then((responsePayload: any) => {
							this.log('Handler resolved with:', responsePayload);
							sendResponse({
								__mailbox__: true,
								source: this.source as SourceType,
								dest: message.source,
								requestId,
								type: `RESPONSE_${requestType}`,
								payload: responsePayload,
								ok: true,
							});
						})
						.catch((err: Error) => {
							this.log('Handler rejected with:', err.message);
							sendResponse({
								ok: false,
								error: err?.message || String(err),
							});
						});

					return true;
				}

				return false;
			} catch (err) {
				const error = err as Error;
				sendResponse({
					ok: false,
					error: error?.message || String(error),
				});
				return false;
			}
		}

		if (type?.startsWith('NOTIFY_')) {
			if (this.source === 'CONTENT SCRIPT') {
				this.send(type, payload, 'DOM');
				return false;
			}
		}
		return true;
	}

	/**
	 * Enviar una solicitud y esperar respuesta
	 */
	request(type: string, payload: any, dest: SourceType): Promise<any> {
		const requestId = payload?.method + '_' + crypto.randomUUID();

		return new Promise((resolve) => {
			this.pending.set(requestId, { resolve });

			const message: RuntimeMessage = {
				__mailbox__: true,
				type: `REQUEST_${type}`,
				payload,
				requestId,
				source: this.source as SourceType,
				dest,
			};

			if (dest === 'BACKGROUND' || dest === 'EXTENSION') {
				chrome.runtime.sendMessage(message, (response: RuntimeResponse) => {
					if (chrome.runtime.lastError) {
						console.error(
							'No extension page open:',
							chrome.runtime.lastError.message
						);
						return;
					}

					const pending = this.pending.get(requestId);

					if (pending) {
						pending.resolve(response);
						this.pending.delete(requestId);
					}
				});
			} else {
				this.send(`REQUEST_${type}`, payload, dest, '*', { requestId });
			}
		});
	}

	/**
	 * Registrar un handler para una solicitud
	 */
	on(
		type: string,
		handler: (
			payload: any,
			sender: any,
			sendResponse?: (response: RuntimeResponse) => void
		) => any
	): void {
		this.handlers.set(type, handler);
		this.log('Registered handler for', type);
	}

	/**
	 * Eliminar un handler
	 */
	off(type: string): void {
		this.handlers.delete(type);
		this.log('Removed handler for', type);
	}
}
