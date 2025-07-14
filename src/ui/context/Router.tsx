import { createContext, JSX } from 'preact';
import { useState } from 'preact/hooks';
import { Home } from '../views/Home.tsx';
import { AIChat } from '../views/AIChat.tsx';
import { AccountUI } from '../views/AccountUI.tsx';
import { PorfolioUI } from '../views/PorfolioUI.tsx';
import { ImportEfirma } from '../views/ImportEfirma.tsx';
import { ApprovalUI } from '../views/ApprovalUI.tsx';

type Props = {
	children: JSX.Element;
};

export const RouterContext = createContext({
	goTo: (_page: string, _sidepanel?: boolean, _props?: any) => {},
	popupView: 'home',
	sidepanelView: 'home',
	render: (_page: string) => <Home />,
});

export const Router = ({ children }: Props) => {
	const [popupView, setPopupView] = useState<string>('home');
	const [sidepanelView, setSidepanelView] = useState<string>('home');
	const [props, setProps] = useState<Record<string, unknown>>({});

	function goTo(page: string, sidepanel?: boolean, _props?: any) {
		sidepanel ? setSidepanelView(page) : setPopupView(page);
		if (_props) {
			setProps(_props);
		}
	}

	function render(page: string): JSX.Element {
		page = page.toLocaleLowerCase();
		switch (page) {
			case 'home':
				return <Home />;
			case 'aichat':
				return <AIChat />;
			case 'cuenta':
				return <AccountUI />;
			case 'portafolio':
				return <PorfolioUI />;
			case 'import':
				return <ImportEfirma />;
			case 'approval':
				return <ApprovalUI {...props} />;
			default:
				return <Home />;
		}
	}

	return (
		<RouterContext.Provider value={{ goTo, popupView, sidepanelView, render }}>
			{children}
		</RouterContext.Provider>
	);
};
