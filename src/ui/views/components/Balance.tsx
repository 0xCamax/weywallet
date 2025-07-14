import { useState } from 'preact/hooks';

interface BalanceProps {
	balance: number;
	currency?: string;
	changePercent?: number | null;
	changeAmount?: number | null;
	className?: string;
}

export const Balance = ({
	balance,
	currency = 'USD',
	changePercent = null,
	changeAmount = null,
	className = '',
}: BalanceProps) => {
	const [showBalance, setShowBalance] = useState<boolean>(true);
	
	const formatBalance = (amount: number): string => {
		if (typeof amount !== 'number') return '$0.00';

		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	const formatChange = (amount: number): string => {
		if (typeof amount !== 'number') return '$0.00';

		const formatted = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(Math.abs(amount));

		return amount >= 0 ? `+${formatted}` : `-${formatted}`;
	};

	const isPositiveChange = changePercent !== null ? changePercent >= 0 : false;

	return (
		<div className={`relative w-full max-w-xl ${className}`}>
			{/* Card Container */}
			<div className="card bg-base-100 shadow-xl border border-base-300 relative overflow-hidden rounded-2xl p-6 mb-1">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-base-content/5 to-transparent"></div>
				<div className="absolute -top-4 -right-4 w-24 h-24 bg-base-content/5 rounded-full blur-xl"></div>
				<div className="absolute -bottom-4 -left-4 w-32 h-32 bg-base-content/5 rounded-full blur-xl"></div>

				{/* Card Content */}
				<div className="relative z-10 space-y-4 flex flex-col justify-center items-center">
					{/* Balance Section */}
					<div className="bg-base-content/10 backdrop-blur-sm rounded-lg p-3 space-y-2 w-full">
						<div className="flex items-center justify-between">
							<span className="text-sm text-base-content font-medium">
								Balance
							</span>
							<button
								onClick={() => setShowBalance(!showBalance)}
								className="text-xs text-base-content/50 hover:text-base-content/70 transition-colors duration-200 p-1 rounded hover:bg-base-content/5"
								title={showBalance ? 'Ocultar balance' : 'Mostrar balance'}
								type="button"
							>
								{showBalance ? '👁️' : '🙈'}
							</button>
						</div>

						<div className="flex items-center justify-center py-2">
							<span className="text-3xl font-bold text-base-content font-mono">
								{showBalance ? formatBalance(balance) : '••••••'}
							</span>
						</div>

						{/* Change Information */}
						{(changePercent !== null || changeAmount !== null) && showBalance && (
							<div className="flex items-center justify-between">
								<span className="text-sm text-base-content font-medium">
									Cambio
								</span>
								<div className="flex items-center space-x-2">
									{changeAmount !== null && (
										<span
											className={`text-sm font-mono ${
												isPositiveChange ? 'text-green-600' : 'text-red-600'
											}`}
										>
											{formatChange(changeAmount)}
										</span>
									)}
									{changePercent !== null && (
										<span
											className={`text-xs px-2 py-1 rounded-full ${
												isPositiveChange 
													? 'bg-green-100 text-green-700' 
													: 'bg-red-100 text-red-700'
											}`}
										>
											{isPositiveChange ? '+' : ''}
											{changePercent.toFixed(2)}%
										</span>
									)}
								</div>
							</div>
						)}

						{!showBalance && (
							<div className="flex items-center justify-center py-2">
								<span className="text-sm text-base-content/50">Balance oculto</span>
							</div>
						)}
					</div>

					{/* Last Updated */}
					<div className="w-full flex justify-center">
						<span className="text-xs text-base-content/50">
							Actualizado: {new Date().toLocaleTimeString()}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};