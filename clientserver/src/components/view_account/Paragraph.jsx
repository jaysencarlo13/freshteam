export default function Paragraph({ title, value }) {
	return (
		<p>
			{title}: <br /> <b>{value || '-'}</b>
		</p>
	);
}
