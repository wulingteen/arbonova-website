const functions = require('@google-cloud/functions-framework');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');

// Configure Nodemailer to use Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Will be set to arbonova.inc@gmail.com
    pass: process.env.GMAIL_PASS, // The 16-character App Password
  },
});

functions.http('helloHttp', (req, res) => {
  // Wrap in CORS to allow requests from the frontend
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
      const { name, company, email, challenge, message } = req.body;

      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Construct Email Subject and Content
      const subject = `[ArboNova 官網表單] 新聯繫：${name} (${company || '未填寫公司'})`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #6C5CE7;">ArboNova 官網收到新的聯繫表單 🎉</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 120px;">姓名</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">公司名稱</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${company || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">電子信箱</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <a href="mailto:${email}">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">最大挑戰</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${challenge || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">訊息內容</td>
              <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">
            此信件由 ArboNova 官方網站自動寄出，請直接回覆 ${email} 與潛在客戶聯繫。
          </p>
        </div>
      `;

      const mailOptions = {
        from: `ArboNova Website <arbonova.inc@gmail.com>`,
        to: 'contact@arbonova.com.tw', // Where you want to receive notifications
        subject: subject,
        html: htmlContent,
        replyTo: email, // Set reply-to to the person who submitted the form
      };

      // Send the email via Gmail SMTP
      await transporter.sendMail(mailOptions);

      res.status(200).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email.' });
    }
  });
});
