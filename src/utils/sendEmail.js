import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  const { data, error } = await resend.emails.send({
    from: 'Sentinel Security <no-reply@sentinel-auth.com>',
    to,
    subject,
    html,
  });

  if (error) {
    return error;
  }

  return data;
};