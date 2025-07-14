import { JSX } from 'preact/jsx-runtime';
import { useState } from 'preact/hooks';
import { useAccount } from '../context/hooks/index.tsx';
import { CHAINS } from '../../common/constants/chains.ts';
import { ModalPortal } from './components/ModalPortal.tsx';

interface CertInfo {
	commonName: string;
	email?: string;
	publicKey?: string;
	serialNumber: string;
	issuer: string;
	validFrom: string;
	validTo: string;
}

interface Props {
	className?: string;
}

export const AccountUI = ({ className }: Props): JSX.Element => {
	const { account, select, create } = useAccount();
	const { activeAccount, keys, efirma } = account;
	const { ensName, public: address } = activeAccount;
	const chainName = CHAINS.map((c) => c.name).join(', ');
	const [showCertDetails, setShowCertDetails] = useState(false);
	const [copied, setCopied] = useState(false);
	const shortAddress = `${address.slice(0, 10)}...${address.slice(-10)}`;
	const [newKeyTag, setNewKeyTag] = useState('');
	const [password, setPassword] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [modalError, setModalError] = useState('');

	const handleCopyAddress = async () => {
		try {
			await navigator.clipboard.writeText(ensName || address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Error al copiar:', err);
		}
	};

	return (
		<div className={`relative w-full max-w-xl ${className ?? ""}`}>
			{/* Actions */}
			<div className="w-full relative z-10 p-1 gap-2 flex justify-between">
				{keys.length > 0 && (
					<select
						className="select select-bordered"
						onChange={(e) => {
							const selected = keys.find(
								(k) => k.public === e.currentTarget.value
							);
							if (selected) select(selected.public);
						}}
						value={activeAccount.public}
					>
						{keys.map((key) => (
							<option key={key.public} value={key.public}>
								{key.tag ?? key.public.slice(0, 12) + '...'}
							</option>
						))}
					</select>
				)}
				<button
					type="button"
					className="btn btn-sm btn-outline"
					onClick={() => setShowModal(true)}
				>
					＋
				</button>
			</div>

			{showModal && (
				<ModalPortal>
					<div
						className="modal modal-open fixed z-[9999] overflow-hidden"
						role="dialog"
						style="scrollbar-width: none;"
					>
						<div className="modal-box">
							<h3 className="font-bold text-lg">Crear nueva llave</h3>
							<p className="py-2 text-sm text-base-content/70">
								Confirma tu contraseña y etiqueta para generar una nueva clave.
							</p>

							<form
								className="space-y-3"
								onSubmit={(e) => {
									e.preventDefault();

									create(password, newKeyTag.trim())
										.then(() => {
											setNewKeyTag('');
											setPassword('');
											setShowModal(false);
										})
										.catch((err) => {
											setModalError(err.message);
											setPassword('');
										});
								}}
							>
								<input
									type="text"
									placeholder="Etiqueta (opcional)"
									value={newKeyTag}
									onInput={(e) =>
										setNewKeyTag((e.target as HTMLInputElement).value)
									}
									className="input input-bordered w-full"
								/>
								<input
									type="password"
									placeholder="Contraseña"
									required
									value={password}
									onInput={(e) =>
										setPassword((e.target as HTMLInputElement).value)
									}
									className="input input-bordered w-full"
								/>
								{modalError && (
									<div className="text-error text-sm text-center">
										{modalError}
									</div>
								)}
								<div className="modal-action">
									<button
										type="button"
										className="btn btn-ghost"
										onClick={() => setShowModal(false)}
									>
										Cancelar
									</button>
									<button type="submit" className="btn btn-primary">
										Crear
									</button>
								</div>
							</form>
						</div>
						<div
							className="modal-backdrop"
							onClick={() => setShowModal(false)}
						></div>
					</div>
				</ModalPortal>
			)}
			{/* Card Container */}
			<div className="card bg-base-100 shadow-xl border border-base-300 relative overflow-hidden rounded-2xl p-6">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-base-content/5 to-transparent"></div>
				<div className="absolute -top-4 -right-4 w-24 h-24 bg-base-content/5 rounded-full blur-xl"></div>
				<div className="absolute -bottom-4 -left-4 w-32 h-32 bg-base-content/5 rounded-full blur-xl"></div>

				{/* Card Content */}
				<div className="relative z-10 space-y-4 flex flex-col justify-center items-center">
					{/* EVM Account Info */}
					<div className="bg-base-content/10 backdrop-blur-sm rounded-lg p-3 space-y-2 w-full">
						<div className="flex items-center justify-between">
							<span className="text-sm text-base-content font-medium">
								Cuenta
							</span>
							<div className="flex items-center space-x-2">
								<button
									type="button"
									className="text-xs text-base-content/50 hover:text-base-content/70 transition-colors duration-200 p-1 rounded hover:bg-base-content/5"
									title={copied ? '¡Copiado!' : 'Copiar dirección'}
									onClick={handleCopyAddress}
								>
									{copied ? '✔️' : '📄'}
								</button>
								<span
									className={`text-sm font-mono transition-colors duration-200 ${
										copied
											? 'text-green-600 font-semibold'
											: 'text-base-content/70'
									}`}
								>
									{ensName || shortAddress}
								</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-base-content font-medium">
								Redes
							</span>
							<span className="text-sm text-base-content/70">{chainName}</span>
						</div>
					</div>

					{/* Certificate Details (Expandable) */}
					{efirma && showCertDetails && (
						<div className="bg-base-content/5 backdrop-blur-sm rounded-lg p-3 space-y-2 border border-base-content/10 w-full">
							<div className="flex items-center justify-between">
								<span className="text-sm text-base-content font-medium">
									Nombre
								</span>
								<span className="text-xs text-base-content/70 font-mono break-all">
									{efirma.certificate.subject.commonName}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-base-content font-medium">
									RFC
								</span>
								<span className="text-xs text-base-content/70 font-mono overflow-auto">
									{efirma.certificate.subject.RFC}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-base-content font-medium">
									email
								</span>
								<span className="text-xs text-base-content/70 font-mono overflow-auto">
									{efirma.certificate.subject.emailAddress}
								</span>
							</div>

							<div className="flex flex-col">
								<span className="text-sm text-base-content font-medium mb-1">
									Emisor
								</span>
								<span className="text-xs text-base-content/70 break-all">
									{efirma.certificate.issuer.commonName}
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-sm text-base-content font-medium mb-1">
									Vigencia
								</span>
								<span className="text-xs text-base-content/70">
									{new Date(
										efirma.certificate.validity.notBefore
									).toLocaleString('es-MX')}{' '}
									→{' '}
									{new Date(
										efirma.certificate.validity.notAfter
									).toLocaleString('es-MX')}
								</span>
							</div>
						</div>
					)}

					{/* Action Button - Más sutil */}
					{efirma && (
						<div className="w-full flex justify-center">
							<button
								type="button"
								className="text-xs text-base-content/50 hover:text-base-content/70 transition-colors duration-200 underline decoration-dotted underline-offset-2"
								onClick={() => setShowCertDetails(!showCertDetails)}
							>
								{showCertDetails ? 'Ocultar detalles' : 'Más información'}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
