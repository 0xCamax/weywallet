import { Dispatch, StateUpdater, useState } from 'preact/hooks';
import type { JSX } from 'preact/jsx-runtime';
import { useAccount } from '../context/hooks/index.tsx';

type Props = {
	setSession: Dispatch<StateUpdater<boolean | null>>;
};

export function AuthForm({ setSession }: Props): JSX.Element {
	const { login, register } = useAccount();

	const [isLogin, setIsLogin] = useState(true);
	const [accountId, setAccountId] = useState('');
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [certFile, setCertFile] = useState<File | null>(null);
	const [keyFile, setKeyFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (isLogin) {
				await login(accountId, password);
			} else {
				if (!certFile || !keyFile) {
					throw new Error('Debes subir ambos archivos .cer y .key');
				}
				await register(userName, certFile, keyFile, password);
			}
			setSession(true);
		} catch (err: any) {
			setError(err.message || 'Ocurrió un error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 bg-base-100 p-6 rounded-xl shadow-lg space-y-4">
			<h2 className="text-lg font-bold text-center">
				{isLogin ? 'Iniciar sesión' : 'Registro de nuevo usuario'}
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<label className="form-control w-full">
					<div className="label">
						<span className="label-text">
							{' '}
							{isLogin ? 'RFC' : 'Nombre de usuario'}
						</span>
					</div>
					<input
						type="text"
						className="input input-bordered w-full"
						value={isLogin ? accountId : userName}
						onInput={(e) =>
							isLogin
								? setAccountId((e.target as HTMLInputElement).value)
								: setUserName((e.target as HTMLInputElement).value)
						}
						required
					/>
				</label>

				<label className="form-control w-full">
					<div className="label">
						<span className="label-text">Contraseña</span>
					</div>
					<input
						type="password"
						className="input input-bordered w-full"
						value={password}
						onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
						required
					/>
				</label>

				{!isLogin && (
					<>
						<label className="form-control w-full">
							<div className="label">
								<span className="label-text">Archivo .cer</span>
							</div>
							<input
								type="file"
								accept=".cer"
								className="file-input file-input-bordered w-full"
								onChange={(e) =>
									setCertFile((e.target as HTMLInputElement).files?.[0] || null)
								}
								required
							/>
						</label>

						<label className="form-control w-full">
							<div className="label">
								<span className="label-text">Archivo .key</span>
							</div>
							<input
								type="file"
								accept=".key"
								className="file-input file-input-bordered w-full"
								onChange={(e) =>
									setKeyFile((e.target as HTMLInputElement).files?.[0] || null)
								}
								required
							/>
						</label>
					</>
				)}

				{error && <div className="text-error text-sm text-center">{error}</div>}

				<button
					type="submit"
					className="btn btn-primary w-full mt-2"
					disabled={loading}
				>
					{loading
						? 'Procesando...'
						: isLogin
						? 'Iniciar sesión'
						: 'Registrarse'}
				</button>
			</form>

			<div className="text-center text-sm">
				{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
				<button
					type="button"
					onClick={() => setIsLogin(!isLogin)}
					className="text-primary underline hover:text-primary-focus"
				>
					{isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
				</button>
			</div>
		</div>
	);
}
