import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, termsAccepted, privacyAccepted, avvAccepted } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    if (!termsAccepted || !privacyAccepted || !avvAccepted) {
      return NextResponse.json({ error: 'All legal agreements must be accepted' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        tier: 'FREE',
        termsAcceptedAt: now,
        privacyAcceptedAt: now,
        avvAcceptedAt: now,
      },
    });

    return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error registering user' }, { status: 500 });
  }
}
