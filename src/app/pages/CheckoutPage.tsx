import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../contexts/BuilderContext';
import { Checkout } from '../components/Checkout';
import { PesapalPaymentModal } from '../components/PesapalPaymentModal';
import { orderService } from '../../services/orderService';

export function CheckoutPage() {
    const navigate = useNavigate();
    const {
        selectedProductObjects,
        selectedLibraryPackObjects,
        storageType,
        storageCapacity,
        totalStorage,
        customerLocation,
        customerDetails,
        totalAmount,
        currentOrder,
        setCurrentOrder,
        resetBuilder
    } = useBuilder();

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handlePaymentStart = async (method: 'pesapal' | 'offline') => {
        if (!customerDetails.name || !customerDetails.email) {
            alert('Missing customer details. Please return to the previous step.');
            return;
        }

        if (totalAmount <= 0) {
            alert('Invalid order total. Please verify your product selection.');
            return;
        }

        try {
            // Create Order
            const newOrder = await orderService.createOrder({
                customer: {
                    name: customerDetails.name,
                    email: customerDetails.email,
                    phone: customerDetails.phone,
                    location: customerLocation || 'Unknown' // Fallback
                },
                items: {
                    products: selectedProductObjects,
                    libraryPacks: selectedLibraryPackObjects
                },
                storage: {
                    type: storageType,
                    capacity: storageCapacity || 0
                },
                totalStorage,
                totalAmount
            });

            setCurrentOrder(newOrder);

            if (method === 'pesapal') {
                setShowPaymentModal(true);
            } else {
                // Offline Payment logic
                // Maybe show a modal with instructions or just alert?
                // Ideally we'd have an "OfflineSuccessPage" or "OrderConfirmationPage"
                // For now, simple alert + redirect
                alert(`Order Placed Successfully! Order ID: ${newOrder.id}\nPlease contact us to complete payment.`);
                resetBuilder();
                navigate('/');
            }

        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to initialize payment. Please try again.');
        }
    };

    return (
        <>
            <Checkout
                selectedProducts={selectedProductObjects}
                selectedLibraryPacks={selectedLibraryPackObjects}
                storageType={storageType}
                storageCapacity={storageCapacity || 0}
                totalStorage={totalStorage}
                customerLocation={customerLocation}
                customerName={customerDetails.name}
                customerEmail={customerDetails.email}
                customerPhone={customerDetails.phone}
                totalAmount={totalAmount}
                onBack={() => navigate('/summary')}
                onPaymentStart={handlePaymentStart}
            />

            {showPaymentModal && currentOrder && (
                <PesapalPaymentModal
                    order={currentOrder}
                    onClose={() => setShowPaymentModal(false)}
                    onPaymentComplete={async (trackingId: string) => {
                        // Update order with Pesapal tracking ID and mark as paid
                        await orderService.updateOrderStatus(currentOrder.id, 'paid', 'pesapal');
                        setShowPaymentModal(false);
                        resetBuilder();
                        alert(`Payment Successful! Order ID: ${currentOrder.id.slice(0, 8)}`);
                        navigate('/'); // Go back home
                    }}
                />
            )}
        </>
    );
}
