import { useEffect, useState } from 'preact/hooks';
import { UserInfo } from './components/UserInfo.tsx';
import { Tabs } from './components/Tabs.tsx';
import { AuthForm } from './Authentication.tsx';
import { useAccount } from '../context/hooks/index.tsx';

export const Home = () => {
	const { account, getSession, logout } = useAccount();
	const { userName, type } = account;
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState<boolean | null>(null);
	

	useEffect(() => {
		if (session === null) {
			getSession()
				.then((b) => setSession(b))
				.catch((err) => {
					console.warn('[Session]', 'No activa o inválida:', err);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [session]);

	if (loading) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		);
	}

	return session ? (
		<div className="w-full flex flex-col justify-center items-center">
			<UserInfo
				userName={userName}
				type={type}
				logout={() => {
					logout();
					setSession(null);
				}}
			/>
			<Tabs tabs={['Cuenta', 'Portafolio']} />
		</div>
	) : (
		<div className="w-full flex flex-col justify-center items-center">
			<AuthForm setSession={setSession} />
		</div>
	);
};
