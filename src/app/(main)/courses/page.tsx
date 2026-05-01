import Link from "next/link";
import {
  Search,
  Star,
  Users,
  Play,
  Code,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDuration, formatPrice } from "@/lib/utils";

function fmtLevel(level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") {
  if (level === "BEGINNER") return "Beginner";
  if (level === "INTERMEDIATE") return "Intermediate";
  return "Advanced";
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const level = typeof sp.level === "string" ? sp.level : undefined;

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      ...(category && category !== "All" ? { category } : {}),
      ...(level && level !== "All"
        ? { level: level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      author: { select: { name: true } },
      sections: { include: { lessons: { select: { duration: true } } } },
      reviews: { select: { rating: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = courses.map((course) => {
    const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
    const totalDuration = course.sections.reduce(
      (acc, s) => acc + s.lessons.reduce((a, l) => a + (l.duration || 0), 0),
      0
    );
    const averageRating =
      course.reviews.length > 0
        ? course.reviews.reduce((a, r) => a + r.rating, 0) / course.reviews.length
        : 0;

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.shortDesc || course.description.slice(0, 140),
      price: course.price,
      isFree: course.isFree,
      rating: averageRating,
      students: course._count.enrollments,
      level: fmtLevel(course.level),
      category: course.category || "General",
      author: course.author.name || "Creator",
      lessons: totalLessons,
      duration: formatDuration(totalDuration),
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Browse Courses</h1>
        <p className="text-muted-foreground mt-2">
          Discover {formatted.length}+ courses to boost your skills
        </p>
      </div>

      {/* Filters (server-rendered, querystring-driven) */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <form>
            <input
              name="search"
              defaultValue={search || ""}
              placeholder="Search courses..."
              className="w-full pl-10 h-12 rounded-md border bg-background px-3 text-sm shadow-sm"
            />
          </form>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Web Development", "Data Science", "Programming", "Mobile Development", "DevOps"].map(
            (c) => (
              <Link
                key={c}
                href={{
                  pathname: "/courses",
                  query: { ...(search ? { search } : {}), category: c, ...(level ? { level } : {}) },
                }}
              >
                <Button
                  variant={category === c || (!category && c === "All") ? "default" : "outline"}
                  size="sm"
                  className={
                    category === c || (!category && c === "All")
                      ? "bg-violet-600 hover:bg-violet-700"
                      : ""
                  }
                >
                  {c}
                </Button>
              </Link>
            )
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <SlidersHorizontal className="h-4 w-4 mt-1.5 text-muted-foreground" />
        {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
          <Link
            key={l}
            href={{
              pathname: "/courses",
              query: { ...(search ? { search } : {}), ...(category ? { category } : {}), level: l },
            }}
          >
            <Button variant={level === l || (!level && l === "All") ? "secondary" : "ghost"} size="sm">
              {l}
            </Button>
          </Link>
        ))}
      </div>

      {/* Results */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {formatted.length} course{formatted.length !== 1 && "s"}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formatted.map((course, i) => (
          <div key={course.id}>
            <Link href={`/courses/${course.slug}`}>
              <Card className="group hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                <div className="relative aspect-video bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                  <Code className="h-12 w-12 text-violet-500/50" />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {course.category}
                  </Badge>
                  {course.isFree && (
                    <Badge className="absolute top-3 right-3" variant="success">
                      Free
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      {course.rating ? course.rating.toFixed(1) : "—"}
                    </div>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-violet-500 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between mt-auto">
                  <div className="text-sm text-muted-foreground">
                    {course.lessons} lessons • {course.duration}
                  </div>
                  <div className="text-lg font-bold">
                    {course.isFree ? (
                      <span className="text-emerald-500">Free</span>
                    ) : (
                      formatPrice(course.price)
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {formatted.length === 0 && (
        <div className="text-center py-20">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
