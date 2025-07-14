import { useTheme } from "../../../context/hooks/index.tsx";

export const Header = () => {
	const { changeTheme, theme } = useTheme();

	return (
		<header className="flex items-center justify-between p-4 shadow-sm h-full">
			<div className="flex items-baseline gap-2">
				<strong className="text-xl font-bold text-primary">Wey Wallet</strong>
				<span className="text-sm">v1.0</span>
			</div>
			<label className="swap swap-rotate">
				<input
					type="checkbox"
					checked={theme}
					onChange={() => changeTheme(!theme)}
				/>

				<span className="swap-on w-6 h-6 text-warning">🌙</span>
				<span className="swap-off w-6 h-6 text-info">🌞</span>
			</label>
		</header>
	);
};

