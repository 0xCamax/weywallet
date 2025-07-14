import { createContext, JSX } from 'preact';
import { Mailbox as Mail } from '../../common/mailbox/Mailbox.ts';
import { useEffect } from 'preact/hooks';
import { useRouter } from './hooks/index.tsx';
import { getCurrentTab } from '../../common/mailbox/utils/utils.ts';

const mailbox = new Mail('EXTENSION');

export const MailboxContext = createContext({
	request: async (type: string, args: any) =>
		await mailbox.request(type, { ...args, method: type }, 'BACKGROUND'),
	notify: (event: string, payload: any) =>
		mailbox.send(`NOTIFY_${event}`, payload, 'CONTENT SCRIPT'),
});

export const Mailbox = ({ children }: { children: JSX.Element }) => {
	const { goTo } = useRouter();

	useEffect(() => {
		mailbox.on('APPROVAL', async (req) => {
			const requestId = crypto.randomUUID();
			const promise = new Promise((resolve) => {
				mailbox.pending.set(requestId, { resolve });
			});

			const onApprove = (password: string) => {
				const pending = mailbox.pending.get(requestId);
				if (pending) {
					pending.resolve(password);
					mailbox.pending.delete(requestId);
					goTo('home', true);
				}
			};

			const onReject = () => {
				const pending = mailbox.pending.get(requestId);
				if (pending) {
					pending.resolve(null);
					mailbox.pending.delete(requestId);
					goTo('home', true);
				}
			};

			chrome.sidePanel.open({
				tabId: await getCurrentTab(),
			});

			goTo('approval', true, { request: req, onApprove, onReject });

			const result = await promise;

			return result;
		});
	}, []);

	return (
		<MailboxContext.Provider
			value={{
				request: async (type: string, args: any) =>
					await mailbox.request(type, { ...args, method: type }, 'BACKGROUND'),
				notify: (event: string, payload: any) =>
					mailbox.send(`NOTIFY_${event}`, payload, 'CONTENT SCRIPT'),
			}}
		>
			{children}
		</MailboxContext.Provider>
	);
};
