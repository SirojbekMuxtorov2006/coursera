import { db } from "@/lib/db";
import { requireUser } from "@/lib/server-auth";
import { getCourseEntitlement } from "@/lib/entitlements";
import { jsonCreated, jsonError, jsonOk, errorToResponse } from "@/lib/http";
import { z } from "zod";

const zCreate = z.object({
  lessonId: z.string().min(1),
  content: z.string().min(1).max(4000),
  parentId: z.string().min(1).optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");
    if (!lessonId) return jsonError("lessonId is required", 400);

    const comments = await db.comment.findMany({
      where: { lessonId, parentId: null },
      include: {
        user: { select: { name: true, image: true } },
        replies: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return jsonOk(comments);
  } catch (e) {
    return errorToResponse(e);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const parsed = zCreate.safeParse(await req.json());
    if (!parsed.success) return jsonError("Invalid request", 400, { issues: parsed.error.issues });

    const lesson = await db.lesson.findUnique({
      where: { id: parsed.data.lessonId },
      select: { id: true, section: { select: { courseId: true } } },
    });
    if (!lesson) return jsonError("Lesson not found", 404);

    const entitlement = await getCourseEntitlement({
      userId: session.user.id,
      courseId: lesson.section.courseId,
      lessonId: lesson.id,
    });
    if (!entitlement.entitled) return jsonError("Forbidden", 403);

    const comment = await db.comment.create({
      data: {
        userId: session.user.id,
        lessonId: parsed.data.lessonId,
        content: parsed.data.content,
        parentId: parsed.data.parentId ?? null,
      },
    });

    return jsonCreated(comment);
  } catch (e) {
    return errorToResponse(e);
  }
}

