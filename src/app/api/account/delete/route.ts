import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-08-26.dahlia',
});

// GDPR Art. 17 (right to erasure): permanently deletes the user's account
// and all associated data. Irreversible — requires re-confirming the
// account password for credentials-based accounts (OAuth-only accounts are
// already re-authenticated by their live session, so no extra check there).
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.password) {
      const { password } = await req.json().catch(() => ({ password: undefined }));
      if (!password || typeof password !== 'string') {
        return NextResponse.json({ error: 'Password confirmation is required' }, { status: 400 });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 403 });
      }
    }

    // Cancel any active Stripe subscription so deletion doesn't leave the
    // user being billed for an account that no longer exists. Best-effort:
    // a Stripe failure shouldn't block the user's right to erasure.
    if (user.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (err) {
        console.error('Failed to cancel Stripe subscription during account deletion:', err);
      }
    }

    // Password reset tokens are keyed by email, not a userId FK, so they
    // aren't covered by Prisma's onDelete: Cascade on the User relations.
    await prisma.passwordResetToken.deleteMany({ where: { email: user.email! } });

    // Deleting the user cascades Account, Session, Customer, and
    // CatalogItem rows per the schema's onDelete: Cascade relations.
    await prisma.user.delete({ where: { id: user.id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete account. Please try again.' }, { status: 500 });
  }
}
