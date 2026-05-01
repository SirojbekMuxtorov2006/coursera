import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthedSession } from "@/lib/server-auth";
import { getCourseEntitlement } from "@/lib/entitlements";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const course = await db.course.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
        sections: {
          orderBy: { position: "asc" },
          include: {
            lessons: { orderBy: { position: "asc" } },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const session = await getAuthedSession();
    const isAdmin = session?.user?.role === "ADMIN";
    if (!course.isPublished && !isAdmin) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    const entitlement = await getCourseEntitlement({
      userId: session?.user?.id,
      courseId: course.id,
    });

    const entitled = entitlement.entitled;

    const dto = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      shortDesc: course.shortDesc,
      thumbnail: course.thumbnail,
      price: course.price,
      isFree: course.isFree,
      level: course.level,
      category: course.category,
      tags: course.tags,
      author: course.author,
      entitled,
      sections: course.sections.map((s) => ({
        id: s.id,
        title: s.title,
        position: s.position,
        lessons: s.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          duration: l.duration,
          position: l.position,
          isFree: l.isFree,
          videoUrl: entitled || l.isFree || course.isFree ? l.videoUrl : null,
          content: entitled || l.isFree || course.isFree ? l.content : null,
        })),
      })),
    };

    return NextResponse.json(dto);
  } catch (error) {
    console.error("Course detail fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

