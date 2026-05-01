import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getAuthedSession } from "@/lib/server-auth";
import { getCourseEntitlement } from "@/lib/entitlements";
import type { CourseDetailDTO } from "@/lib/dto";
import { CourseClient } from "@/components/course/course-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({
    where: { slug },
    select: { title: true, shortDesc: true, description: true, thumbnail: true },
  });

  if (!course) return {};

  return {
    title: course.title,
    description: course.shortDesc ?? course.description.slice(0, 160),
    openGraph: {
      title: course.title,
      description: course.shortDesc ?? course.description.slice(0, 160),
      images: course.thumbnail ? [course.thumbnail] : undefined,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      sections: {
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } },
      },
    },
  });

  if (!course || !course.isPublished) notFound();

  const session = await getAuthedSession();
  const entitlement = await getCourseEntitlement({
    userId: session?.user?.id,
    courseId: course.id,
  });

  const entitled = entitlement.entitled;

  const dto: CourseDetailDTO = {
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

  return <CourseClient course={dto} />;
}
