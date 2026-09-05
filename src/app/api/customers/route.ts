import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(customers);
  } catch (error: any) {
    console.error('Customers GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const data = await req.json();


    // Feature Gating: Limit address book to 5 customers for FREE tier
    if (user.tier !== 'PRO') {
      const customerCount = await prisma.customer.count({ where: { userId: user.id } });
      if (customerCount >= 5) {
        return NextResponse.json({ error: 'Free tier is limited to 5 saved customers. Upgrade to PRO for unlimited.' }, { status: 403 });
      }
    }

    // Input validation

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        name: data.name.trim().substring(0, 200),
        street: data.street?.trim().substring(0, 200) || null,
        city: data.city?.trim().substring(0, 100) || null,
        zip: data.zip?.trim().substring(0, 20) || null,
        country: data.country?.trim().substring(0, 5) || 'DE',
        vat: data.vat?.trim().substring(0, 50) || null
      }
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Customers POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
