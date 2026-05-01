import { db } from "@/lib/db";
import { requireUser } from "@/lib/server-auth";
import { getCourseEntitlement } from "@/lib/entitlements";
import { jsonCreated, jsonError, jsonOk, errorToResponse } from "@/lib/http";
import { z } from "zod";

const zCreate = z.object({
  courseId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(4000).optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) return jsonError("courseId is required", 400);

    const reviews = await db.review.findMany({
      where: { courseId },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk(reviews);
  } catch (e) {
    return errorToResponse(e);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const parsed = zCreate.safeParse(await req.json());
    if (!parsed.success) return jsonError("Invalid request", 400, { issues: parsed.error.issues });

    const entitlement = await getCourseEntitlement({
      userId: session.user.id,
      courseId: parsed.data.courseId,
    });
    if (!entitlement.entitled) return jsonError("Forbidden", 403);

    const review = await db.review.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId: parsed.data.courseId } },
      update: { rating: parsed.data.rating, comment: parsed.data.comment ?? null },
      create: {
        userId: session.user.id,
        courseId: parsed.data.courseId,
        rating: parsed.data.rating,
        comment: parsed.data.comment ?? null,
      },
    });

    return jsonCreated(review);
  } catch (e) {
    return errorToResponse(e);
  }
}

