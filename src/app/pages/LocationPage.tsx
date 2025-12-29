import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../contexts/BuilderContext';
import { LocationSelection } from '../components/LocationSelection';

export function LocationPage() {
    const navigate = useNavigate();
    const { setCustomerLocation } = useBuilder();

    return (
        <LocationSelection
            onLocationSelected={(location) => {
                setCustomerLocation(location);
                navigate('/summary');
            }}
            onBack={() => navigate('/')}
        />
    );
}
