import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email },
      select: {
        companyName: true, street: true, city: true, zip: true, country: true, vat: true,
        iban: true, bic: true, bankName: true,
        brandColor: true, logoBase64: true, apiKey: true, tier: true
      }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        companyName: data.companyName,
        street: data.street,
        city: data.city,
        zip: data.zip,
        country: data.country,
        vat: data.vat,
        iban: data.iban,
        bic: data.bic,
        bankName: data.bankName,
        // Branding fields
        brandColor: data.brandColor !== undefined ? data.brandColor : undefined,
        logoBase64: data.logoBase64 !== undefined ? data.logoBase64 : undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
