import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/server-auth";
import { getInitials } from "@/lib/utils";

function relativeTime(d?: Date | null) {
  if (!d) return "—";
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default async function DashboardPage() {
  const session = await requireUser().catch(() => null);
  if (!session) redirect("/auth/login");

  const [enrollments, certificates] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            author: { select: { name: true } },
            sections: { include: { lessons: { select: { id: true, duration: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.certificate.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    }),
  ]);

  const courseLessonIds = enrollments.map((e) => ({
    courseId: e.courseId,
    lessonIds: e.course.sections.flatMap((s) => s.lessons.map((l) => l.id)),
  }));

  const allLessonIds = courseLessonIds.flatMap((x) => x.lessonIds);
  const progressRows = await db.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: allLessonIds } },
    select: { lessonId: true, completed: true, watchedAt: true },
  });

  const progressByLessonId = new Map(progressRows.map((p) => [p.lessonId, p]));

  const enrolledCourses = enrollments.map((enrollment) => {
    const lessonIds = enrollment.course.sections.flatMap((s) => s.lessons.map((l) => l.id));
    const totalLessons = lessonIds.length;
    const completedLessons = lessonIds.filter((id) => progressByLessonId.get(id)?.completed).length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const lastWatchedAt = lessonIds
      .map((id) => progressByLessonId.get(id)?.watchedAt)
      .filter(Boolean)
      .sort((a, b) => (a!.getTime() > b!.getTime() ? -1 : 1))[0];

    return {
      id: enrollment.course.id,
      slug: enrollment.course.slug,
      title: enrollment.course.title,
      author: enrollment.course.author.name || "Creator",
      progress,
      totalLessons,
      completedLessons,
      lastAccessed: relativeTime(lastWatchedAt),
      category: enrollment.course.category || "General",
    };
  });

  const totalMinutesLearned = enrollments.reduce((acc, e) => {
    const lessonIds = e.course.sections.flatMap((s) => s.lessons.map((l) => l.id));
    const completedLessonIds = lessonIds.filter((id) => progressByLessonId.get(id)?.completed);
    const durationByLessonId = new Map(
      e.course.sections.flatMap((s) => s.lessons.map((l) => [l.id, l.duration || 0] as const))
    );
    const seconds = completedLessonIds.reduce((s, id) => s + (durationByLessonId.get(id) || 0), 0);
    return acc + Math.round(seconds / 60);
  }, 0);

  const statsData = [
    {
      label: "Enrolled Courses",
      value: String(enrolledCourses.length),
      icon: BookOpen,
      color: "text-violet-500",
    },
    {
      label: "Minutes Learned",
      value: String(totalMinutesLearned),
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Certificates",
      value: String(certificates.length),
      icon: Award,
      color: "text-emerald-500",
    },
    {
      label: "Current Streak",
      value: "—",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-violet-500/30">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xl">
              {getInitials(session.user?.name || "U")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {session.user?.name?.split(" ")[0] || "Learner"}!
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey
            </p>
          </div>
        </div>
        <Link href="/courses">
          <Button variant="gradient">
            Browse Courses <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statsData.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                    {course.progress === 100 && (
                      <Badge variant="success" className="text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2 group-hover:text-violet-500 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription>by {course.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                      <span>{course.lastAccessed}</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <Button
                    variant="ghost"
                    className="w-full group-hover:text-violet-500"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {course.progress === 100 ? "Review" : "Continue"}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
