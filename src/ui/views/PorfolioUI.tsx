import { useState } from 'preact/hooks';
import { usePortfolio } from '../context/hooks/index.tsx';
import { CHAINS } from '../../common/constants/chains.ts';
import {
	formatMoney,
	formatSupply,
	formatTimeSmart,
} from '../utils/formatters.ts';

export const PorfolioUI = () => {
	const { trackedTokens, add, remove, portfolio, update } = usePortfolio();
	const [newTokenAddress, setNewTokenAddress] = useState<string>('');
	const [newTokenChain, setNewTokenChain] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showDeleteButtons, setShowDeleteButtons] = useState<boolean>(false);

	const isValidEVMAddress = (address: string): boolean => {
		return /^0x[a-fA-F0-9]{40}$/.test(address);
	};

	const updateBalances = () => {
		setIsLoading(true);
		update(trackedTokens).then(() => setIsLoading(false));
	};

	const addToken = async () => {
		const trimmedAddress = newTokenAddress.trim();

		if (!trimmedAddress) {
			setError('Por favor ingresa una dirección de token');
			return;
		}

		if (!isValidEVMAddress(trimmedAddress)) {
			setError('Por favor ingresa una dirección EVM válida (0x...)');
			return;
		}

		if (trackedTokens.some((token) => token.address === trimmedAddress)) {
			setError('Ya existe un token con esta dirección');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			await add(trimmedAddress, newTokenChain);
			setNewTokenAddress('');
			setIsModalOpen(false);
		} catch (err) {
			setError(
				'Error al obtener información del token. Verifica la dirección.'
			);
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteToken = (addressToDelete: string) => {
		remove(addressToDelete);
	};

	const handleAddressChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		setNewTokenAddress(target.value);
		if (error) setError('');
	};

	const openModal = () => {
		setIsModalOpen(true);
		setError('');
		setNewTokenAddress('');
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setError('');
		setNewTokenAddress('');
	};

	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !isLoading) {
			addToken();
		}
		if (e.key === 'Escape') {
			closeModal();
		}
	};

	const copyAddress = async (address: string) => {
		try {
			await navigator.clipboard.writeText(address);
		} catch (err) {
			console.error('Error al copiar:', err);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center w-full max-w-xl">
			{/* Actions */}
			<div className="w-full relative z-10 p-1 gap-2 flex justify-end">
				<button
					type="button"
					onClick={() => updateBalances()}
					className="px-3 py-1.5 bg-base-content/10 hover:bg-base-content/20 text-base-content rounded-lg transition-colors duration-200 text-sm"
					title="Actualizar"
				>
					{'⟳'}
				</button>
				<button
					type="button"
					onClick={openModal}
					className="px-3 py-1.5 bg-base-content/10 hover:bg-base-content/20 text-base-content rounded-lg transition-colors duration-200 text-sm"
					title="Agregar nuevo token"
				>
					+
				</button>
				<button
					type="button"
					onClick={() => setShowDeleteButtons(!showDeleteButtons)}
					className="px-3 py-1.5 bg-base-content/10 hover:bg-base-content/20 text-base-content rounded-lg transition-colors duration-200 text-sm"
					title={
						showDeleteButtons
							? 'Ocultar opciones de eliminar'
							: 'Mostrar opciones de eliminar'
					}
				>
					{showDeleteButtons ? '✕' : '📝'}
				</button>
			</div>

			{/* Tokens List Section */}
			<div className="w-full space-y-4">
				{trackedTokens.length === 0 ? (
					<div className="card bg-base-100 shadow-xl border border-base-300 relative overflow-hidden rounded-2xl p-8">
						<div className="absolute inset-0 bg-gradient-to-br from-base-content/5 to-transparent"></div>
						<div className="relative z-10 text-center text-base-content/70">
							<p className="text-lg">No hay tokens agregados aún.</p>
							<p className="text-sm mt-2">
								Agrega tu primer token para comenzar a rastrear tu portafolio.
							</p>
						</div>
					</div>
				) : (
					<div className="card bg-base-100 shadow-xl border border-base-300 relative overflow-hidden rounded-2xl p-4">
						{/* Background Pattern */}
						<div className="absolute inset-0 bg-gradient-to-br from-base-content/5 to-transparent"></div>
						<div className="absolute -top-4 -right-4 w-24 h-24 bg-base-content/5 rounded-full blur-xl"></div>
						<div className="absolute -bottom-4 -left-4 w-32 h-32 bg-base-content/5 rounded-full blur-xl"></div>

						<div className="relative z-10">
							{/* Header */}
							<div className="flex items-center justify-between p-3 mb-2 border-b border-base-content/10">
								<div className="text-sm font-medium text-base-content/70">
									Token
								</div>
								<div className="text-sm font-medium text-base-content/70">
									Balance
								</div>
							</div>

							<div className="space-y-3">
								{trackedTokens.map((token, index) => (
									<div
										key={token.address}
										className={`flex items-center justify-between p-3 rounded-lg bg-base-content/5 hover:bg-base-content/10 transition-colors duration-200 ${
											index !== trackedTokens.length - 1
												? 'border-b border-base-content/10'
												: ''
										}`}
									>
										<div className="flex-1 flex justify-between items-center group">
											<div className="flex items-center gap-2">
												<div className="flex flex-col">
													<div className="flex items-center gap-2">
														<h4 className="font-semibold text-base-content">
															{token.symbol === ''
																? token.name || 'Token ' + index
																: token.symbol}
														</h4>
														<button
															type="button"
															className="text-xs text-base-content/50 hover:text-base-content/70 transition-colors duration-200 p-1 rounded hover:bg-base-content/5"
															title="Copiar dirección"
															onClick={() => copyAddress(token.address)}
														>
															{'📄'}
														</button>
														{/* Chain badge - only show on hover */}
														<div className="badge badge-outline badge-xs text-base-content/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
															{CHAINS.find((c) => c.id === token.chain)?.name ??
																token.chain}
														</div>
													</div>
													{/* Show supply on hover */}
													<span className="text-xs text-base-content/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
														Supply:{' '}
														{formatSupply(token.totalSupply, token.decimals)}
													</span>
												</div>
											</div>

											<div className="text-sm text-base-content/70 text-right">
												<div className="flex flex-col items-end">
													<span className="font-semibold">
														{isLoading ? (
															<span className="animate-pulse">
																<span className="animate-ping">. . .</span>
															</span>
														) : (
															formatMoney(
																portfolio.tokenData![token.address]?.balance,
																token.decimals
															) ?? '-'
														)}
													</span>
													<span className="text-xs text-base-content/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
														Ultima Actualización:{' '}
														{portfolio.tokenData &&
														portfolio.tokenData[token.address]
															? formatTimeSmart(
																	portfolio.tokenData[token.address].lastUpdate
															  )
															: '-'}
													</span>
												</div>
											</div>
										</div>

										{showDeleteButtons && (
											<button
												type="button"
												onClick={() => deleteToken(token.address)}
												className="ml-4 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors duration-200 backdrop-blur-sm border border-red-500/20 text-sm"
											>
												Eliminar
											</button>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="card bg-base-100 shadow-xl border border-base-300 relative overflow-hidden rounded-2xl p-6 w-full max-w-md mx-4">
						{/* Background Pattern */}
						<div className="absolute inset-0 bg-gradient-to-br from-base-content/5 to-transparent"></div>
						<div className="absolute -top-4 -right-4 w-24 h-24 bg-base-content/5 rounded-full blur-xl"></div>

						<div className="relative z-10">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-base-content">
									Agregar Token
								</h3>
								<button
									type="button"
									onClick={closeModal}
									className="text-base-content/50 hover:text-base-content/70 focus:outline-none"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-base-content mb-2">
									Dirección del Token
								</label>
								<input
									type="text"
									value={newTokenAddress}
									onChange={handleAddressChange}
									onKeyPress={handleKeyPress}
									placeholder="Ingresa la dirección del token (0x...)"
									className="w-full px-4 py-2 bg-base-content/10 border border-base-content/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-base-content/30 focus:border-transparent text-base-content placeholder:text-base-content/50"
									disabled={isLoading}
								/>
								<label className="block text-sm font-medium text-base-content mb-2">
									Chain
								</label>

								<select
									value={newTokenChain}
									onChange={(e) => setNewTokenChain(e.currentTarget.value)}
									disabled={isLoading}
									className="w-full px-4 py-2 bg-base-content/10 border border-base-content/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-base-content/30 focus:border-transparent text-base-content placeholder:text-base-content/50"
								>
									<option value="">Selecciona una cadena</option>
									{CHAINS.map((chain) => (
										<option key={chain.id} value={chain.id}>
											{chain.name}
										</option>
									))}
								</select>
								{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
							</div>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={closeModal}
									className="flex-1 px-4 py-2 bg-base-content/10 hover:bg-base-content/20 text-base-content rounded-lg transition-colors duration-200 border border-base-content/20"
									disabled={isLoading}
								>
									Cancelar
								</button>
								<button
									type="button"
									onClick={addToken}
									className="flex-1 px-4 py-2 bg-base-content text-base-100 rounded-lg hover:bg-base-content/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={isLoading}
								>
									{isLoading ? 'Agregando...' : 'Agregar Token'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
