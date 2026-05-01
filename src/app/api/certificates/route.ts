import { db } from "@/lib/db";
import { requireUser } from "@/lib/server-auth";
import { zCertificateCreateBody } from "@/lib/validators";
import { errorToResponse, jsonCreated, jsonError, jsonOk } from "@/lib/http";

export async function POST(req: Request) {
  try {
    const session = await requireUser();

    const parsed = zCertificateCreateBody.safeParse(await req.json());
    if (!parsed.success) return jsonError("Invalid request", 400, { issues: parsed.error.issues });
    const { courseId } = parsed.data;

    // Check if enrolled
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
    });

    if (!enrollment) {
      return jsonError("Not enrolled in this course", 403);
    }

    // Check completion
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

    const completedLessons = await db.lessonProgress.count({
      where: {
        userId: session.user.id,
        lessonId: { in: lessonIds },
        completed: true,
      },
    });

    if (completedLessons < lessonIds.length) {
      return jsonError(
        {
          message: "Course not completed",
          completed: completedLessons,
          total: lessonIds.length,
        },
        400
      );
    }

    const certificate = await db.certificate.upsert({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
      update: {
        certificateUrl: null,
      },
      create: {
        userId: session.user.id,
        courseId,
        certificateUrl: null,
      },
    });

    await db.certificate.update({
      where: { id: certificate.id },
      data: { certificateUrl: `/api/certificates/${certificate.id}/pdf` },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: "ACHIEVEMENT",
        title: "Certificate Earned!",
        message: `Congratulations! You've earned a certificate for completing "${course.title}".`,
      },
    });

    return jsonCreated({
      ...certificate,
      certificateUrl: `/api/certificates/${certificate.id}/pdf`,
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return errorToResponse(error);
  }
}

export async function GET() {
  try {
    const session = await requireUser();

    const certificates = await db.certificate.findMany({
      where: { userId: session.user.id },
      include: {
        course: { select: { title: true, slug: true, thumbnail: true } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return jsonOk(
      certificates.map((c) => ({
        ...c,
        certificateUrl: c.certificateUrl || `/api/certificates/${c.id}/pdf`,
      }))
    );
  } catch (error) {
    console.error("Certificates fetch error:", error);
    return errorToResponse(error);
  }
}
