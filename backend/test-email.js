require('dotenv').config();
const nodemailer = require('nodemailer');
const { orderPlacedTemplate } = require('./src/templates/emailTemplates');

console.log('Testing email service...');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const testEmail = process.env.EMAIL_USER;
const testOrderId = '507f1f77bcf86cd799439011';

console.log(`\nSending test email to: ${testEmail}`);

const emailHtml = orderPlacedTemplate('Test User', testOrderId);

transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: testEmail,
  subject: 'Test Order Placed - Vendora',
  html: emailHtml,
})
.then((info) => {
  console.log('✅ Email sent successfully!');
  console.log('Message ID:', info.messageId);
  console.log('Check your inbox at:', testEmail);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Email sending failed:', error.message);
  process.exit(1);
});
