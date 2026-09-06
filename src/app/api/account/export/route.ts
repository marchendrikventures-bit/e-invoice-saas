import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GDPR Art. 15 (right of access) / Art. 20 (data portability):
// lets a user download everything we hold on them as a single JSON file.
// Deliberately excludes the password hash and internal Stripe/session
// identifiers that aren't "their" data in the portability sense.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        customers: true,
        catalogItems: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      account: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        invoicesCount: user.invoicesCount,
        createdAt: user.createdAt,
        termsAcceptedAt: user.termsAcceptedAt,
        privacyAcceptedAt: user.privacyAcceptedAt,
        avvAcceptedAt: user.avvAcceptedAt,
      },
      companyProfile: {
        companyName: user.companyName,
        street: user.street,
        city: user.city,
        zip: user.zip,
        country: user.country,
        vat: user.vat,
        iban: user.iban,
        bic: user.bic,
        bankName: user.bankName,
        brandColor: user.brandColor,
        hasLogo: !!user.logoBase64,
      },
      billing: {
        hasActiveSubscription: !!user.stripeSubscriptionId,
      },
      customers: user.customers.map((c) => ({
        name: c.name, street: c.street, city: c.city, zip: c.zip, country: c.country, vat: c.vat,
      })),
      catalogItems: user.catalogItems.map((i) => ({
        description: i.description, price: i.price, taxPercent: i.taxPercent,
      })),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="my-data-export.json"',
      },
    });
  } catch (error: unknown) {
    console.error('Data export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
