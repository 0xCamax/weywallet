import { createPortal } from 'preact/compat';
import { JSX } from 'preact/jsx-runtime';

export const ModalPortal = ({ children }: { children: JSX.Element }) => {
	const modalRoot = document.getElementById('root');
	if (!modalRoot) {
		console.warn('No se encontró #root');
		return null;
	}
	return createPortal(children, modalRoot);
};