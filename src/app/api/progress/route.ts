import { db } from "@/lib/db";
import { requireUser } from "@/lib/server-auth";
import { getCourseEntitlement } from "@/lib/entitlements";
import { zProgressUpsertBody } from "@/lib/validators";
import { errorToResponse, jsonError, jsonOk } from "@/lib/http";

export async function POST(req: Request) {
  try {
    const session = await requireUser();

    const parsed = zProgressUpsertBody.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("Invalid request", 400, { issues: parsed.error.issues });
    }

    const { lessonId, completed } = parsed.data;

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        isFree: true,
        section: { select: { courseId: true, course: { select: { isFree: true } } } },
      },
    });

    if (!lesson) return jsonError("Lesson not found", 404);

    const courseId = lesson.section.courseId;
    const entitlement = await getCourseEntitlement({
      userId: session.user.id,
      courseId,
      lessonId,
    });
    if (!entitlement.entitled) return jsonError("Forbidden", 403);

    const progress = await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed,
        watchedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed,
        watchedAt: completed ? new Date() : null,
      },
    });

    return jsonOk(progress);
  } catch (error) {
    console.error("Progress update error:", error);
    return errorToResponse(error);
  }
}

export async function GET(req: Request) {
  try {
    const session = await requireUser();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return jsonError("courseId is required", 400);
    }

    const entitlement = await getCourseEntitlement({
      userId: session.user.id,
      courseId,
    });
    if (!entitlement.entitled) return jsonError("Forbidden", 403);

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: { lessons: { select: { id: true } } },
        },
      },
    });

    if (!course) {
      return jsonError("Course not found", 404);
    }

    const lessonIds = course.sections.flatMap((s) =>
      s.lessons.map((l) => l.id)
    );

    const progress = await db.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        lessonId: { in: lessonIds },
      },
    });

    const completedCount = progress.filter((p) => p.completed).length;
    const totalLessons = lessonIds.length;

    return jsonOk({
      progress,
      completedCount,
      totalLessons,
      percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return errorToResponse(error);
  }
}
