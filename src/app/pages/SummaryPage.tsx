import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../contexts/BuilderContext';
import { PriceCalculation } from '../components/PriceCalculation';

export function SummaryPage() {
    const navigate = useNavigate();
    const {
        selectedProductObjects,
        selectedLibraryPackObjects,
        storageType,
        storageCapacity,
        totalStorage,
        customerLocation,
        setCustomerDetails,
        setTotalAmount
    } = useBuilder();

    return (
        <PriceCalculation
            selectedProducts={selectedProductObjects}
            selectedLibraryPacks={selectedLibraryPackObjects}
            storageType={storageType}
            storageCapacity={storageCapacity || 0}
            totalStorage={totalStorage}
            customerLocation={customerLocation}
            onContinueToCheckout={(details) => {
                setCustomerDetails({ name: details.name, email: details.email });
                setTotalAmount(details.totalAmount);
                navigate('/checkout');
            }}
            onBack={() => navigate('/location')}
        />
    );
}
