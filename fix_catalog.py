import re

with open('src/app/api/catalog/route.ts', 'r') as f:
    content = f.read()

limit_logic = """
    // Feature Gating: Limit catalog to 10 items for FREE tier
    if (user.tier !== 'PRO') {
      const itemCount = await prisma.catalogItem.count({ where: { userId: user.id } });
      if (itemCount >= 10) {
        return NextResponse.json({ error: 'Free tier is limited to 10 saved items. Upgrade to PRO for unlimited.' }, { status: 403 });
      }
    }

    // Input validation
"""

content = content.replace("    // Input validation", limit_logic)

with open('src/app/api/catalog/route.ts', 'w') as f:
    f.write(content)
