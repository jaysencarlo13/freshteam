import { ErrorMessage } from '@hookform/error-message';

function Input({ name, type, value, text, placeholder, handle, err }) {
	return (
		<div className="mb-3">
			<label htmlFor={name} className="form-label">
				{text}
			</label>
			<input {...handle(name, { required: true })} name={name} value={value} type={type} className="form-control" id={name} placeholder={placeholder} required />

			<ErrorMessage errors={err} name={name} render={({ message }) => <div className="error">{message}</div>} />
		</div>
	);
}

export default Input;
