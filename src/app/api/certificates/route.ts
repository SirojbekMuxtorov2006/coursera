import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();

    // Check if enrolled
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      );
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
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
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
      return NextResponse.json(
        {
          error: "Course not completed",
          completed: completedLessons,
          total: lessonIds.length,
        },
        { status: 400 }
      );
    }

    // Generate certificate (placeholder URL - integrate with PDF generation)
    const certificate = await db.certificate.upsert({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
      update: {},
      create: {
        userId: session.user.id,
        courseId,
        certificateUrl: `/api/certificates/${session.user.id}/${courseId}/pdf`,
      },
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

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificates = await db.certificate.findMany({
      where: { userId: session.user.id },
      include: {
        course: { select: { title: true, slug: true, thumbnail: true } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Certificates fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
