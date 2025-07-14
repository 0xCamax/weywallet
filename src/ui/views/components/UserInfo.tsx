import { useEffect } from "preact/hooks";
import { useAccount, usePortfolio } from '../../context/hooks/index.tsx';
import { formatTokenBalance } from '../../utils/formatters.ts';
import { Balance } from './Balance.tsx';

type Props = {
	userName: string;
	type: string;
	logout: () => void;
};

export const UserInfo = ({ userName, type, logout }: Props) => {
	const { portfolio, refToken, update } = usePortfolio();
	const { account } = useAccount()
	useEffect(()=>{
		update(portfolio.trackedTokens!)
	},[account])
	return (
		<div className="flex flex-col gap-2 p-4 rounded-xl bg-base-100 w-full justify-center items-center max-w-xl">
			<div className="flex items-center justify-between w-full">
				<h2 className="text-xl font-bold text-base-content">{userName}</h2>
				<button
					type="button"
					className="btn badge badge-outline capitalize text-sm"
				>
					{type == 'free' ? 'Upgrade' : 'Premium'}
				</button>
				<button
					type="button"
					className="btn btn-ghost text-sm text-base-content/60 hover:text-error transition-colors"
					onClick={() => logout()}
				>
					Cerrar sesión
				</button>
			</div>

			<Balance
				balance={
					Number(formatTokenBalance(portfolio.tokenData![refToken.address]?.balance ?? 0, refToken.decimals))
				}
			/>
		</div>
	);
};
