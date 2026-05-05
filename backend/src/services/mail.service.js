const nodemailer = require('nodemailer');

// Initialize transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function (async, non-blocking)
const sendEmail = async (to, subject, html) => {
  console.log(`[EMAIL] Queuing email to: ${to}, subject: ${subject}`);
  
  // Send email asynchronously without blocking
  setImmediate(async () => {
    try {
      console.log(`[EMAIL] Sending email to: ${to}`);
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });

      console.log('[EMAIL] Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('[EMAIL] Email sending failed:', error.message);
    }
  });

  return { success: true, message: 'Email queued for sending' };
};

module.exports = { sendEmail };
