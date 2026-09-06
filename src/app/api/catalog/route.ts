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

    const items = await prisma.catalogItem.findMany({
      where: { userId: user.id },
      orderBy: { description: 'asc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Catalog GET error:', error);
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


    // Feature Gating: Limit catalog to 10 items for FREE tier
    if (user.tier !== 'PRO') {
      const itemCount = await prisma.catalogItem.count({ where: { userId: user.id } });
      if (itemCount >= 10) {
        return NextResponse.json({ error: 'Free tier is limited to 10 saved items. Upgrade to PRO for unlimited.' }, { status: 403 });
      }
    }

    // Input validation

    if (!data.description || typeof data.description !== 'string') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const price = parseFloat(data.price);
    const taxPercent = parseFloat(data.taxPercent);
    if (isNaN(price) || price < 0 || isNaN(taxPercent) || taxPercent < 0 || taxPercent > 100) {
      return NextResponse.json({ error: 'Invalid price or tax percent' }, { status: 400 });
    }

    const item = await prisma.catalogItem.create({
      data: {
        userId: user.id,
        description: data.description.trim().substring(0, 500),
        price,
        taxPercent
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Catalog POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
