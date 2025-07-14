import { render } from 'preact';
import { App } from './App.tsx';
import { Router } from './context/Router.tsx';
import { Theme } from './context/Theme.tsx';
import { Portfolio } from './context/Portfolio.tsx';
import { Account } from './context/Account.tsx';
import { Mailbox } from './context/Mailbox.tsx';

render(
	<Theme>
		<Router>
			<Account>
				<Portfolio>
					<Mailbox>
						<App sidepanel />
					</Mailbox>
				</Portfolio>
			</Account>
		</Router>
	</Theme>,
	document.getElementById('root')!
);
