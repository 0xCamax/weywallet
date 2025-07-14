import { useState } from 'preact/hooks';
import { SignatureRequest } from '../../common/db/squemas.ts';

type Props = {
	request: SignatureRequest;
	onApprove: (password: string) => void;
	onReject: () => void;
};

export function ApprovalUI({ request, onApprove, onReject }: Props) {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = () => {
		if (!password) {
			setError('Password is required to approve.');
			return;
		}
		setError('');
		onApprove(password);
	};

	return (
		<div className="p-4 space-y-4">
			<h2 className="text-lg font-bold">Signature Request</h2>

			<div className="grid grid-cols-1 gap-2 text-sm">
				<div>
					<span className="font-semibold">Type:</span> {request.type}
				</div>

				<div>
					<span className="font-semibold">Sender:</span> {request.sender}
				</div>
				<div>
					<span className="font-semibold">Timestamp:</span> {request.timestamp}
				</div>
				{request.payload && (
					<div className="break-all">
						<span className="font-semibold">Payload:</span>
						<pre className="bg-base-200 p-2 rounded overflow-x-auto max-h-40">
							{JSON.stringify(request.payload, null, 2)}
						</pre>
					</div>
				)}
			</div>

			<div className="form-control">
				<label className="label">
					<span className="label-text">Confirm with password</span>
				</label>
				<input
					type="password"
					className="input input-bordered"
					placeholder="Enter your password"
					value={password}
					onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
				/>
				{error && <p className="text-error text-sm mt-1">{error}</p>}
			</div>

			<div className="flex justify-end gap-2">
				<button
					type="button"
					onClick={onReject}
					className="btn btn-outline btn-error"
				>
					Reject
				</button>
				<button
					type="button"
					onClick={handleSubmit}
					className="btn btn-primary"
				>
					Approve
				</button>
			</div>
		</div>
	);
}
