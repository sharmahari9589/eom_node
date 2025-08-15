import nodemailer from "nodemailer";

export async function sendNotificationEmail({ to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, 
      port: process.env.SMTP_PORT || 587,
      secure: false, // 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send mail
    const info = await transporter.sendMail({
      from: `"My App Notifications" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log("Notification Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("Email Notification Error:", error);
    return { success: false, error };
  }
}
