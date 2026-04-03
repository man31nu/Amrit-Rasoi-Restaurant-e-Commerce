const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"RestaurantX" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

const sendOrderConfirmation = async (user, order) => {
  const message = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h1 style="color: #4CAF50;">Order Confirmation</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for your order! Your payment has been successfully verified.</p>
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <hr />
      <p>We'll notify you once your food is on the way!</p>
      <p>Warm regards,<br />The RestaurantX Team</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Your RestaurantX Order Confirmation',
    message: message,
  });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
};
