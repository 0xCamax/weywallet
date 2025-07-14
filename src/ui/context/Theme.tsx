import { createContext, JSX } from 'preact';
import { useState } from 'preact/hooks';

type Props = {
	children: JSX.Element;
};

export const ThemeContext = createContext({
	theme: true,
	changeTheme: (_theme: boolean) => {},
});

export const Theme = ({ children }: Props) => {
	const [theme, setTheme] = useState<boolean>(true);
	const changeTheme = (theme: boolean) => {
		setTheme(theme);
		if (theme) {
			document.getElementById('html')!.setAttribute('data-theme', 'dim');
		} else {
			document.getElementById('html')!.setAttribute('data-theme', 'nord');
		}
	};
	return (
		<ThemeContext.Provider value={{ theme, changeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
