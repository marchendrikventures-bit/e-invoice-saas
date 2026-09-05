import re

with open('src/app/api/customers/route.ts', 'r') as f:
    content = f.read()

limit_logic = """
    // Feature Gating: Limit address book to 5 customers for FREE tier
    if (user.tier !== 'PRO') {
      const customerCount = await prisma.customer.count({ where: { userId: user.id } });
      if (customerCount >= 5) {
        return NextResponse.json({ error: 'Free tier is limited to 5 saved customers. Upgrade to PRO for unlimited.' }, { status: 403 });
      }
    }

    // Input validation
"""

content = content.replace("    // Input validation", limit_logic)

with open('src/app/api/customers/route.ts', 'w') as f:
    f.write(content)
