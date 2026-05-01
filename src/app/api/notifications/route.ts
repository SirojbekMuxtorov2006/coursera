import { db } from "@/lib/db";
import { requireUser } from "@/lib/server-auth";
import { jsonOk, errorToResponse } from "@/lib/http";

export async function GET() {
  try {
    const session = await requireUser();
    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return jsonOk(notifications);
  } catch (e) {
    return errorToResponse(e);
  }
}

