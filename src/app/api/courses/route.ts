import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const search = searchParams.get("search");

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(category && { category }),
        ...(level && { level: level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        author: { select: { name: true, image: true } },
        sections: {
          include: { lessons: { select: { id: true, duration: true } } },
        },
        reviews: { select: { rating: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = courses.map((course) => ({
      ...course,
      totalLessons: course.sections.reduce(
        (acc, s) => acc + s.lessons.length,
        0
      ),
      totalDuration: course.sections.reduce(
        (acc, s) =>
          acc +
          s.lessons.reduce((a, l) => a + (l.duration || 0), 0),
        0
      ),
      averageRating:
        course.reviews.length > 0
          ? course.reviews.reduce((a, r) => a + r.rating, 0) /
            course.reviews.length
          : 0,
      studentCount: course._count.enrollments,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, description, shortDesc, price, level, category, tags } =
      body;

    const course = await db.course.create({
      data: {
        title,
        slug,
        description,
        shortDesc,
        price: price || 0,
        isFree: !price || price === 0,
        level: level || "BEGINNER",
        category,
        tags: tags || [],
        authorId: session.user.id,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Course creation error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
