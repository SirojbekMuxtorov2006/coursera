import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/server-auth";
import { jsonOk, errorToResponse } from "@/lib/http";

export async function GET() {
  try {
    await requireAdmin();

    const courses = await db.course.findMany({
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk(
      courses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        price: c.price,
        isFree: c.isFree,
        isPublished: c.isPublished,
        enrollments: c._count.enrollments,
      }))
    );
  } catch (e) {
    return errorToResponse(e);
  }
}

