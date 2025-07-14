import { handleRpcRequest } from './handlers.js';
import { Mailbox } from '../../common/mailbox/Mailbox.ts';
import { sensitiveMethods } from '../../common/mailbox/config.ts';

const mailbox = new Mailbox('CONTENT SCRIPT');

mailbox.on('WALLET', async (payload, sender) => {
	try {
		const { method } = payload;

		if (sensitiveMethods.has(method)) {
			const response = await mailbox.request(method, payload, 'BACKGROUND');
			const { payload: data, ok } = response;

			if (ok) {
				return data;
			} else {
				return 'No response from wallet';
			}
		} else {
			const data = await handleRpcRequest(payload);

			return { data };
		}
	} catch (err) {
		console.error(err);
	}
});
