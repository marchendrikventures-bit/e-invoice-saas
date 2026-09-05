import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  
  // In development without a real API key, just log it.
  if (process.env.RESEND_API_KEY === 're_123' || !process.env.RESEND_API_KEY) {
    console.log(`[DEV MODE] Password reset email for ${email}: ${resetLink}`);
    return;
  }

  await resend.emails.send({
    from: 'support@eu-invoice.app',
    to: email,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `
  });
};
