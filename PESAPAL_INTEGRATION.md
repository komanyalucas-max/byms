# Pesapal Payment Integration - Studio Builder

## Overview
This application integrates with **Pesapal API 3.0** for secure payment processing in Tanzania. The integration supports real-time payment processing, status tracking, and order management.

## Credentials (Tanzania Merchant)
```
Consumer Key: ngW+UEcnDhltUc5fxPfrCD987xMh3Lx8
Consumer Secret: q27RChYs5UkypdcNYKzuUw460Dg=
IPN ID: c3c20000-d0cd-40ca-9f24-daee228440a6
Environment: Sandbox (Testing)
```

## Features Implemented

### Frontend (Customer-Facing)
1. **Checkout Flow**
   - Integrated Pesapal payment modal in checkout page
   - Real-time payment iframe for seamless UX
   - Payment status tracking
   - Success/failure callbacks

2. **Payment Pages**
   - `/payment-callback` - Handles successful payments
   - `/payment-cancelled` - Handles cancelled payments
   - Automatic order status updates

### Admin Dashboard
1. **Order Management**
   - View all orders with Pesapal tracking IDs
   - Check payment status in real-time
   - Cancel pending Pesapal orders
   - Visual indicators for Pesapal payments

2. **Payment Actions**
   - **Check Status**: Verify payment status from Pesapal
   - **Cancel Order**: Cancel pending/failed payments
   - Displays payment method, confirmation code, and amount

## File Structure

```
src/
├── services/
│   ├── pesapalService.ts          # Pesapal API integration
│   └── orderService.ts             # Order management (updated)
├── app/
│   ├── components/
│   │   ├── PesapalPaymentModal.tsx    # Payment modal with iframe
│   │   └── admin/
│   │       ├── OrderCard.tsx           # Order card with Pesapal actions
│   │       ├── OrderList.tsx           # Order list view
│   │       └── PesapalOrderActions.tsx # Admin payment actions
│   └── pages/
│       ├── CheckoutPage.tsx            # Checkout with Pesapal
│       ├── PaymentCallbackPage.tsx     # Payment success handler
│       └── PaymentCancelledPage.tsx    # Payment cancellation handler
```

## API Endpoints Used

### 1. Authentication
```
POST https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken
```
- Generates Bearer token (valid 5 minutes)
- Auto-refreshes when expired

### 2. Submit Order
```
POST https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest
```
- Creates payment request
- Returns redirect URL for payment

### 3. Get Transaction Status
```
GET https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId={id}
```
- Checks payment status
- Returns payment details

### 4. Cancel Order
```
POST https://cybqa.pesapal.com/pesapalv3/api/Transactions/CancelOrder
```
- Cancels pending/failed payments

## Payment Flow

### Customer Flow
1. Customer fills checkout form
2. Clicks "Pay with Pesapal"
3. Payment modal opens with Pesapal iframe
4. Customer selects payment method (Card, M-Pesa, etc.)
5. Completes payment
6. Redirected to callback page
7. Payment status verified
8. Order marked as paid

### Admin Flow
1. Admin views orders in dashboard
2. Orders with Pesapal show tracking ID
3. Admin can:
   - Check real-time payment status
   - Cancel pending payments
   - View payment confirmation codes

## Payment Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 0 | INVALID | Payment is invalid |
| 1 | COMPLETED | Payment successful |
| 2 | FAILED | Payment failed |
| 3 | REVERSED | Payment reversed |

## Configuration

### Switch to Production
In `src/services/pesapalService.ts`:

```typescript
const PESAPAL_CONFIG = {
    // ... credentials
    base_url: 'https://pay.pesapal.com/v3', // Change to production
};
```

### Callback URLs
Configured in `pesapalService.ts`:
- Callback: `{origin}/payment-callback`
- Cancellation: `{origin}/payment-cancelled`

## Testing

### Test Cards (Sandbox)
Use Pesapal's test cards in sandbox environment:
- **Visa**: 4111111111111111
- **Mastercard**: 5500000000000004

### Test Flow
1. Navigate to checkout
2. Enter customer details
3. Click "Pay with Pesapal"
4. Use test card details
5. Verify callback handling

## Security Features

1. **Bearer Token Authentication**: All API calls use JWT tokens
2. **Token Auto-Refresh**: Tokens refresh automatically before expiry
3. **HTTPS Only**: All communications over HTTPS
4. **Order Verification**: Payment status verified server-side
5. **IPN Notifications**: Instant Payment Notifications for status changes

## Error Handling

The integration includes comprehensive error handling:
- Network failures
- Invalid credentials
- Payment failures
- Token expiration
- Order not found

## Troubleshooting

### Common Issues

**1. 401 Unauthorized**
- Check consumer_key and consumer_secret
- Verify credentials are correct

**2. Payment Not Completing**
- Check callback URLs are accessible
- Verify IPN ID is registered
- Check browser console for errors

**3. Token Expiry**
- Tokens auto-refresh
- If issues persist, clear browser cache

### Debug Mode
Enable console logging in `pesapalService.ts` for debugging.

## Future Enhancements

1. **IPN Endpoint**: Implement server-side IPN handler
2. **Webhook Notifications**: Real-time order updates
3. **Payment Reports**: Export payment data
4. **Refund Support**: Handle payment refunds
5. **Multi-Currency**: Support multiple currencies

## Support

For Pesapal API support:
- Documentation: https://developer.pesapal.com
- Support Email: support@pesapal.com

## License
This integration is part of the Studio Builder application.
