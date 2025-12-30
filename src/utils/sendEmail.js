import { Resend } from "resend";
import { conf } from "../conf/index.js";

const resend = new Resend(conf.resend.apiKey);

/**
 * Send an email using Resend.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise<Object|null>} returns data on success, null on failure
 *
 * @warning **Domain Verification Required**:
 * To send emails to arbitrary addresses (Production), you MUST verify your domain in the Resend Dashboard.
 * By default, `onboarding@resend.dev` only allows sending to the registered account email.
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Sentinel IAM <onboarding@resend.dev>", // Change this to your verified domain in production
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("❌ Unexpected Email Error:", err);
    return null;
  }
};
