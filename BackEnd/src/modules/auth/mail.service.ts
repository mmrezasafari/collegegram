import { HttpError } from "../../../utility/http-error";
import { mailTransporter } from "../../config/mailer.config";
export class MailService {
  async sendMail(userEmail: string, subject: string, text: string) {
    try {
      await mailTransporter.sendMail({
        from: `"CollegeGram" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject,
        text,
      });
      console.log("Email sent successfully");
      return true;
    } catch (error) {
      throw new HttpError(500, "خطا در ارسال ایمیل")
    }
  }
}
