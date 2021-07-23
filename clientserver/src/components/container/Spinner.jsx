import './spinner.css';
import Loader from 'react-loader-spinner';
export default function Spinner() {
    return (
        <div className="spinners">
            <Loader type="ThreeDots" color="#00BFFF" height={150} width={150} />
        </div>
    );
}
