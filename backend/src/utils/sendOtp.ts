import transporter from "../config/nodemailer.js";

async function SendEmail(data: {
  to: string;
  subject: string;
  text?: string;
  html: string;
}) {
  let retries = 0;
  try {
    return await transporter.sendMail(data);
  } catch (error) {
    if (retries < 5) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      retries++;
      SendEmail(data);
    }
  }
}

export default SendEmail;