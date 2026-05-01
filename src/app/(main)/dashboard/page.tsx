"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
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
import { getInitials } from "@/lib/utils";

const enrolledCourses = [
  {
    id: "1",
    slug: "fullstack-web-dev",
    title: "Full-Stack Web Development",
    author: "John Doe",
    progress: 42,
    totalLessons: 48,
    completedLessons: 20,
    lastAccessed: "2 hours ago",
    category: "Web Development",
  },
  {
    id: "2",
    slug: "python-data-science",
    title: "Python for Data Science",
    author: "Jane Smith",
    progress: 15,
    totalLessons: 62,
    completedLessons: 9,
    lastAccessed: "1 day ago",
    category: "Data Science",
  },
  {
    id: "3",
    slug: "advanced-typescript",
    title: "Advanced TypeScript",
    author: "Alex Johnson",
    progress: 100,
    totalLessons: 35,
    completedLessons: 35,
    lastAccessed: "3 days ago",
    category: "Programming",
  },
];

const statsData = [
  { label: "Enrolled Courses", value: "3", icon: BookOpen, color: "text-violet-500" },
  { label: "Hours Learned", value: "47", icon: Clock, color: "text-blue-500" },
  { label: "Certificates", value: "1", icon: Award, color: "text-emerald-500" },
  { label: "Current Streak", value: "12 days", icon: TrendingUp, color: "text-orange-500" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10"
      >
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
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
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
      </motion.div>

      {/* Enrolled Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
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
      </motion.div>
    </div>
  );
}
