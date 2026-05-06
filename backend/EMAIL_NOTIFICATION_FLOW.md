# Email Notification System - Complete Flow

## Overview
Automated email notifications are sent to users at different stages of their order journey.

## Email Flow

### 1. Order Placed Email
**Trigger:** When user creates an order
**Sent to:** User's registered email
**Template:** Order Placed Successfully
**Contains:**
- User name
- Order ID
- Order status: "Order Placed"
- Link to view order

**Code Location:** `src/controllers/order.controller.js` - `createOrder()` function

---

### 2. Payment Success Email
**Trigger:** When payment is verified successfully
**Sent to:** User's registered email
**Template:** Payment Successful
**Contains:**
- User name
- Order ID
- Amount paid
- Payment confirmation

**Code Location:** `src/controllers/payment.controller.js` - `verifyPayment()` function

---

### 3. Order Shipped Email
**Trigger:** When admin changes order status from PAID → SHIPPED
**Sent to:** User's registered email
**Template:** Your Order Has Shipped
**Contains:**
- User name
- Order ID
- Tracking number
- Shipping status

**Code Location:** `src/controllers/order.controller.js` - `updateOrderStatus()` function

---

### 4. Order Delivered Email
**Trigger:** When admin changes order status from SHIPPED → DELIVERED
**Sent to:** User's registered email
**Template:** Order Delivered
**Contains:**
- User name
- Order ID
- Delivery confirmation
- Delivery date

**Code Location:** `src/controllers/order.controller.js` - `updateOrderStatus()` function

---

## Configuration

### Environment Variables (.env)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tech.itssem@gmail.com
EMAIL_PASS=celozduxlpqsnzmx
EMAIL_FROM=tech.itssem@gmail.com
FRONTEND_URL=http://localhost:8000
```

### Email Service
- **Library:** nodemailer
- **SMTP Provider:** Gmail
- **Mode:** Async/Non-blocking (uses setImmediate)
- **Location:** `src/services/mail.service.js`

### Email Templates
- **Location:** `src/templates/emailTemplates.js`
- **Style:** HTML with inline CSS
- **Design:** Clean, minimal, professional

---

## Testing

### Test Email Sending
```bash
cd backend
node test-email.js
```

### Check Logs
```bash
# Look for [EMAIL] and [ORDER] logs
tail -f logs/app.log | grep -E "EMAIL|ORDER"
```

---

## Admin Workflow

1. **Admin logs into admin panel** (`/admin`)
2. **Navigate to Orders section**
3. **Select an order to update**
4. **Change status:**
   - PENDING → PAID (manual or via payment)
   - PAID → SHIPPED (triggers "Order Shipped" email)
   - SHIPPED → DELIVERED (triggers "Order Delivered" email)

---

## Troubleshooting

### Emails not received?
1. **Check spam folder**
2. **Verify backend server is restarted** after .env changes
3. **Check console logs** for [EMAIL] messages
4. **Test email service:** `node test-email.js`
5. **Verify Gmail app password** is correct (no spaces)

### Common Issues
- ❌ Backend not restarted after .env changes
- ❌ EMAIL_PASS has spaces (should be: celozduxlpqsnzmx)
- ❌ Wrong environment variable names (use EMAIL_* not SMTP_*)
- ❌ Gmail blocking "less secure apps" (use App Password)

---

## Email Delivery Time
- Emails are sent **asynchronously** (non-blocking)
- Typical delivery: **1-5 seconds**
- Check spam folder if not in inbox

---

## Status
✅ Email service configured
✅ All templates created
✅ Order placed email implemented
✅ Payment success email implemented
✅ Order shipped email implemented
✅ Order delivered email implemented
✅ Async/non-blocking sending
✅ Error handling and logging
