import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.tier !== 'PRO') {
      return NextResponse.json({ error: 'Pro tier required for API access' }, { status: 403 });
    }

    const newApiKey = `sk_test_${randomBytes(16).toString('hex')}`; // Dummy format like stripe

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        apiKey: newApiKey,
      },
    });

    return NextResponse.json({ success: true, apiKey: updated.apiKey });
  } catch (error) {
    console.error('API Key generation error:', error);
    return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 });
  }
}
