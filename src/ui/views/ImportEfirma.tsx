import { JSX } from 'preact/jsx-runtime';
import { useState } from 'preact/hooks';
import { useAccount } from '../context/hooks/index.tsx';

export const ImportEfirma = (): JSX.Element => {
	const [keyFile, setKeyFile] = useState<File | null>(null);
	const [cerFile, setCerFile] = useState<File | null>(null);
	const [fileSecret, setFileSecret] = useState<string>('');
	const [userName, setUserName] = useState<string>('');
	const { register } = useAccount();

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (keyFile && cerFile && fileSecret && userName) {
			register(userName, cerFile, keyFile, fileSecret);

			setCerFile(null);
			setKeyFile(null);
			setFileSecret('');
		}
	};

	return (
		<div className="card bg-base-100 shadow-md max-w-md mx-auto">
			<div className="card-body space-y-4">
				<h2 className="card-title text-lg">Importar e-firma</h2>

				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="form-control">
						<label className="label font-medium">Archivo .key</label>
						<input
							type="file"
							accept=".key"
							className="file-input file-input-bordered w-full"
							onChange={(e) =>
								setKeyFile((e.target as HTMLInputElement).files?.[0] || null)
							}
							required
						/>
					</div>

					<div className="form-control">
						<label className="label font-medium">Archivo .cer</label>
						<input
							type="file"
							accept=".cer"
							className="file-input file-input-bordered w-full"
							onChange={(e) =>
								setCerFile((e.target as HTMLInputElement).files?.[0] || null)
							}
							required
						/>
					</div>
					<div className="form-control">
						<label className="label font-medium">Nombre de usuario</label>
						<input
							type="text"
							className="input input-bordered w-full"
							onChange={(e) =>
								setUserName((e.target as HTMLInputElement).value || '')
							}
							required
						/>
					</div>
					<div className="form-control">
						<label className="label font-medium">Contraseña</label>
						<input
							type="password"
							className="input input-bordered w-full"
							onChange={(e) =>
								setFileSecret((e.target as HTMLInputElement).value || '')
							}
							required
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary w-full"
						disabled={!keyFile || !cerFile}
					>
						Registrar
					</button>
				</form>
			</div>
		</div>
	);
};
