import VerificationEmail from "@/components/email-template";
import { Resend } from "resend";

interface VerificationEmailObj {
  email: string;
  userName: string;
  emailToken: string;
}

// resend api key
const resend = new Resend(process.env.RESEND_API_KEY);

// sending otp to email using resend
export async function sendVerificationEmail({
  email,
  userName,
  emailToken,
}: VerificationEmailObj) {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "NeoKart | Verification Code",
      react: VerificationEmail({ userName, emailToken }),
    });
    return {
      message: "OTP sent to Your Email. Please check Inbox.",
      success: true,
    };
  } catch (error) {
    console.log("Failed to send verification email.", error);
  }
}
