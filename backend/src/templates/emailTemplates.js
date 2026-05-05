const orderPlacedTemplate = (userName, orderId) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #fb923c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9333ea; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #9333ea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Placed Successfully! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Thank you for your order! We've received your order and it's being processed.</p>
      
      <div class="order-box">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> Order Placed</p>
      </div>
      
      <p>We'll send you another email once your order has been shipped.</p>
      <a href="${process.env.FRONTEND_URL}/orders/${orderId}" class="button">View Order</a>
      
      <div class="footer">
        <p>Thank you for shopping with Vendora!</p>
        <p>&copy; ${new Date().getFullYear()} Vendora. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const paymentSuccessTemplate = (userName, orderId, amount) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .checkmark { font-size: 48px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="checkmark">✓</div>
      <h1>Payment Successful!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Your payment has been successfully processed.</p>
      
      <div class="order-box">
        <h3>Payment Details</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Amount Paid:</strong> ₹${amount}</p>
        <p><strong>Status:</strong> Payment Confirmed</p>
      </div>
      
      <p>Your order is now being prepared for shipment.</p>
      <a href="${process.env.FRONTEND_URL}/orders/${orderId}" class="button">View Order</a>
      
      <div class="footer">
        <p>Thank you for shopping with Vendora!</p>
        <p>&copy; ${new Date().getFullYear()} Vendora. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const orderShippedTemplate = (userName, orderId, trackingNumber) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .truck { font-size: 48px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="truck">🚚</div>
      <h1>Your Order Has Shipped!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Great news! Your order is on its way to you.</p>
      
      <div class="order-box">
        <h3>Shipping Details</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber || 'Will be updated soon'}</p>
        <p><strong>Status:</strong> Shipped</p>
      </div>
      
      <p>You can track your order using the tracking number above.</p>
      <a href="${process.env.FRONTEND_URL}/orders/${orderId}" class="button">Track Order</a>
      
      <div class="footer">
        <p>Thank you for shopping with Vendora!</p>
        <p>&copy; ${new Date().getFullYear()} Vendora. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const orderDeliveredTemplate = (userName, orderId) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .gift { font-size: 48px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="gift">🎁</div>
      <h1>Order Delivered!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Your order has been successfully delivered. We hope you love your purchase!</p>
      
      <div class="order-box">
        <h3>Delivery Details</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> Delivered</p>
        <p><strong>Delivered On:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <p>We'd love to hear your feedback about your shopping experience.</p>
      <a href="${process.env.FRONTEND_URL}/orders/${orderId}" class="button">Rate Your Order</a>
      
      <div class="footer">
        <p>Thank you for shopping with Vendora!</p>
        <p>&copy; ${new Date().getFullYear()} Vendora. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  orderPlacedTemplate,
  paymentSuccessTemplate,
  orderShippedTemplate,
  orderDeliveredTemplate,
};
