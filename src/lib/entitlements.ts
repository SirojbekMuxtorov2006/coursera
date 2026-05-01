import { db } from "@/lib/db";

export type CourseEntitlement = {
  entitled: boolean;
  reason:
    | "anonymous"
    | "admin"
    | "course_free"
    | "lesson_free"
    | "enrolled"
    | "subscription"
    | "not_entitled";
};

export async function getCourseEntitlement(params: {
  userId?: string | null;
  courseId: string;
  lessonId?: string | null;
}): Promise<CourseEntitlement> {
  const { userId, courseId, lessonId } = params;

  if (!userId) return { entitled: false, reason: "anonymous" };

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, subscription: { select: { plan: true, currentPeriodEnd: true } } },
  });

  if (!user) return { entitled: false, reason: "anonymous" };
  if (user.role === "ADMIN") return { entitled: true, reason: "admin" };

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { isFree: true },
  });
  if (!course) return { entitled: false, reason: "not_entitled" };
  if (course.isFree) return { entitled: true, reason: "course_free" };

  if (lessonId) {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: { isFree: true },
    });
    if (lesson?.isFree) return { entitled: true, reason: "lesson_free" };
  }

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { id: true },
  });
  if (enrollment) return { entitled: true, reason: "enrolled" };

  const subActive =
    user.subscription?.plan !== "FREE" &&
    (!user.subscription?.currentPeriodEnd ||
      user.subscription.currentPeriodEnd.getTime() > Date.now());
  if (subActive) return { entitled: true, reason: "subscription" };

  return { entitled: false, reason: "not_entitled" };
}

