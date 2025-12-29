// Pesapal API 3.0 Integration Service via Backend Proxy
// Tanzania Merchant Credentials

const PROXY_URL = 'http://localhost/Buildyourmusicproductionstudiov/api/pesapal.php';

const getHeaders = () => ({
    'Content-Type': 'application/json',
});

interface PesapalAuthResponse {
    token: string;
    expiryDate: string;
    error: any;
    status: string;
    message: string;
}

interface PesapalOrderRequest {
    id: string; // Merchant reference (order ID)
    currency: string;
    amount: number;
    description: string;
    callback_url: string;
    cancellation_url?: string;
    notification_id: string;
    branch?: string;
    billing_address: {
        email_address?: string;
        phone_number?: string;
        country_code?: string;
        first_name?: string;
        middle_name?: string;
        last_name?: string;
        line_1?: string;
        line_2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        zip_code?: string;
    };
    redirect_mode?: 'TOP_WINDOW' | 'PARENT_WINDOW';
}

interface PesapalOrderResponse {
    order_tracking_id: string;
    merchant_reference: string;
    redirect_url: string;
    error: any;
    status: string;
    message?: string;
}

interface PesapalTransactionStatus {
    payment_method: string;
    amount: number;
    created_date: string;
    confirmation_code: string;
    payment_status_description: string;
    description: string;
    message: string;
    payment_account: string;
    call_back_url: string;
    status_code: number; // 0=INVALID, 1=COMPLETED, 2=FAILED, 3=REVERSED
    merchant_reference: string;
    currency: string;
    error: any;
    status: string;
}

class PesapalService {
    private IPN_ID = 'c3c20000-d0cd-40ca-9f24-daee228440a6';

    /**
     * Submit order request to Pesapal via backend proxy
     */
    async submitOrder(orderData: PesapalOrderRequest): Promise<PesapalOrderResponse> {
        try {
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    action: 'submit-order',
                    orderData,
                }),
            });

            if (!response.ok) {
                throw new Error(`Order submission failed: ${response.statusText}`);
            }

            const data: PesapalOrderResponse = await response.json();

            if (data.status !== '200') {
                throw new Error(data.message || 'Failed to submit order');
            }

            return data;
        } catch (error) {
            console.error('Pesapal order submission error:', error);
            throw error;
        }
    }

    /**
     * Get transaction status via backend proxy
     */
    async getTransactionStatus(orderTrackingId: string): Promise<PesapalTransactionStatus> {
        try {
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    action: 'get-status',
                    orderTrackingId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to get transaction status: ${response.statusText}`);
            }

            const data: PesapalTransactionStatus = await response.json();

            if (data.status !== '200') {
                throw new Error(data.message || 'Failed to get transaction status');
            }

            return data;
        } catch (error) {
            console.error('Pesapal transaction status error:', error);
            throw error;
        }
    }

    /**
     * Cancel order via backend proxy
     */
    async cancelOrder(orderTrackingId: string): Promise<{ status: string; message: string }> {
        try {
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    action: 'cancel-order',
                    orderTrackingId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Order cancellation failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Pesapal order cancellation error:', error);
            throw error;
        }
    }

    /**
     * Get registered IPN URLs via backend proxy
     */
    async getRegisteredIPNs(): Promise<any[]> {
        try {
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    action: 'get-ipns',
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to get IPNs: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Pesapal get IPNs error:', error);
            throw error;
        }
    }

    /**
     * Helper: Create order request from order data
     */
    createOrderRequest(
        orderId: string,
        amount: number,
        customerEmail: string,
        customerName: string,
        customerPhone?: string,
        description?: string
    ): PesapalOrderRequest {
        const [firstName, ...lastNameParts] = customerName.split(' ');
        const lastName = lastNameParts.join(' ');

        return {
            id: orderId,
            currency: 'TZS', // Tanzanian Shilling
            amount: amount,
            description: description || `Order ${orderId}`,
            callback_url: `${window.location.origin}/payment-callback`,
            cancellation_url: `${window.location.origin}/payment-cancelled`,
            notification_id: this.IPN_ID,
            branch: 'Studio Builder - Online',
            billing_address: {
                email_address: customerEmail,
                phone_number: customerPhone,
                country_code: 'TZ',
                first_name: firstName,
                last_name: lastName || '',
            },
            redirect_mode: 'PARENT_WINDOW',
        };
    }

    /**
     * Get payment status description
     */
    getStatusDescription(statusCode: number): string {
        switch (statusCode) {
            case 0:
                return 'INVALID';
            case 1:
                return 'COMPLETED';
            case 2:
                return 'FAILED';
            case 3:
                return 'REVERSED';
            default:
                return 'UNKNOWN';
        }
    }
}

export const pesapalService = new PesapalService();
export type { PesapalOrderRequest, PesapalOrderResponse, PesapalTransactionStatus };
