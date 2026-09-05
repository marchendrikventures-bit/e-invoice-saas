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
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// SECURITY: Validate hex color format
function isValidHexColor(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

// SECURITY: Max logo size 500KB in base64
const MAX_LOGO_SIZE = 500 * 1024;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Input validation
    if (data.brandColor !== undefined && !isValidHexColor(data.brandColor)) {
      return NextResponse.json({ error: 'Invalid brand color format. Must be hex (e.g. #2563eb)' }, { status: 400 });
    }

    if (data.logoBase64 !== undefined && data.logoBase64 !== null) {
      if (typeof data.logoBase64 !== 'string' || data.logoBase64.length > MAX_LOGO_SIZE) {
        return NextResponse.json({ error: 'Logo file is too large. Max 500KB.' }, { status: 400 });
      }
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        companyName: data.companyName?.trim().substring(0, 200) || undefined,
        street: data.street?.trim().substring(0, 200) || undefined,
        city: data.city?.trim().substring(0, 100) || undefined,
        zip: data.zip?.trim().substring(0, 20) || undefined,
        country: data.country?.trim().substring(0, 5) || undefined,
        vat: data.vat?.trim().substring(0, 50) || undefined,
        iban: data.iban?.trim().substring(0, 50) || undefined,
        bic: data.bic?.trim().substring(0, 20) || undefined,
        bankName: data.bankName?.trim().substring(0, 100) || undefined,
        brandColor: data.brandColor !== undefined ? data.brandColor : undefined,
        logoBase64: data.logoBase64 !== undefined ? data.logoBase64 : undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
