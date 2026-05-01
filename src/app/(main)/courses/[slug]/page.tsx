"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Play,
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const courseData = {
  title: "Full-Stack Web Development with React & Node.js",
  description:
    "Learn how to build modern full-stack web applications using React, Node.js, Express, and MongoDB. This course covers everything from the basics to advanced topics like authentication, deployment, and testing.",
  author: { name: "John Doe", avatar: "JD" },
  rating: 4.8,
  students: 12400,
  level: "Intermediate",
  price: 49.99,
  totalDuration: "24h 30m",
  totalLessons: 48,
  sections: [
    {
      id: "s1",
      title: "Getting Started",
      lessons: [
        { id: "l1", title: "Welcome & Course Overview", duration: "5:30", isFree: true, completed: true },
        { id: "l2", title: "Setting Up Your Environment", duration: "12:45", isFree: true, completed: true },
        { id: "l3", title: "Project Structure", duration: "8:20", isFree: false, completed: false },
      ],
    },
    {
      id: "s2",
      title: "React Fundamentals",
      lessons: [
        { id: "l4", title: "Components & JSX", duration: "15:10", isFree: false, completed: false },
        { id: "l5", title: "State & Props", duration: "18:30", isFree: false, completed: false },
        { id: "l6", title: "Hooks Deep Dive", duration: "22:15", isFree: false, completed: false },
        { id: "l7", title: "Context API & State Management", duration: "20:00", isFree: false, completed: false },
      ],
    },
    {
      id: "s3",
      title: "Backend with Node.js",
      lessons: [
        { id: "l8", title: "Express Server Setup", duration: "14:00", isFree: false, completed: false },
        { id: "l9", title: "REST API Design", duration: "19:30", isFree: false, completed: false },
        { id: "l10", title: "Database Integration", duration: "25:00", isFree: false, completed: false },
      ],
    },
  ],
  reviews: [
    { id: "r1", user: "Alice Brown", avatar: "AB", rating: 5, comment: "Best course I have ever taken! The instructor explains complex topics in a very simple way.", date: "2 weeks ago" },
    { id: "r2", user: "Bob Wilson", avatar: "BW", rating: 4, comment: "Great content. Would love to see more advanced topics covered.", date: "1 month ago" },
  ],
};

export default function CourseDetailPage() {
  const [activeLesson, setActiveLesson] = useState(courseData.sections[0].lessons[0]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["s1"]);
  const [commentText, setCommentText] = useState("");

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const completedLessons = courseData.sections
    .flatMap((s) => s.lessons)
    .filter((l) => l.completed).length;
  const progressPercent =
    (completedLessons / courseData.totalLessons) * 100;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-video rounded-xl overflow-hidden bg-black"
          >
            <ReactPlayer
              src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              width="100%"
              height="100%"
              controls
              playing={false}
              light
              playIcon={
                <div className="h-16 w-16 rounded-full bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Play className="h-7 w-7 text-white ml-1" />
                </div>
              }
            />
          </motion.div>

          {/* Course Info */}
          <div>
            <Badge variant="secondary" className="mb-3">
              {courseData.level}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold">
              {courseData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-foreground">
                  {courseData.rating}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {courseData.students.toLocaleString()} students
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {courseData.totalDuration}
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {courseData.totalLessons} lessons
              </div>
            </div>
          </div>

          <Separator />

          {/* Currently playing */}
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Now Playing
            </p>
            <p className="font-medium">{activeLesson.title}</p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">About This Course</h2>
            <p className="text-muted-foreground leading-relaxed">
              {courseData.description}
            </p>
          </div>

          <Separator />

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviews
            </h2>
            <div className="space-y-4">
              {courseData.reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.user}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }).map(
                              (_, j) => (
                                <Star
                                  key={j}
                                  className="h-3 w-3 fill-yellow-500 text-yellow-500"
                                />
                              )
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Comment */}
            <div className="mt-6">
              <textarea
                className="w-full rounded-xl border bg-background p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={3}
                placeholder="Write a review..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button variant="gradient" size="sm" className="mt-2">
                Submit Review
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enroll Card */}
          <Card className="sticky top-20">
            <CardHeader>
              <div className="text-3xl font-bold">
                {courseData.price === 0 ? (
                  <span className="text-emerald-500">Free</span>
                ) : (
                  `$${courseData.price}`
                )}
              </div>
              <Button variant="gradient" size="lg" className="w-full mt-3">
                Enroll Now
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                30-day money-back guarantee
              </p>
            </CardHeader>

            <Separator />

            {/* Progress */}
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-medium">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} />
              <p className="text-xs text-muted-foreground mt-2">
                {completedLessons} of {courseData.totalLessons} lessons completed
              </p>
            </CardContent>

            <Separator />

            {/* Lesson List */}
            <CardContent className="pt-4 max-h-[500px] overflow-y-auto">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Content
              </h3>
              <div className="space-y-2">
                {courseData.sections.map((section) => (
                  <div key={section.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-accent transition-colors"
                    >
                      <span>{section.title}</span>
                      {expandedSections.includes(section.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.includes(section.id) && (
                      <div className="border-t">
                        {section.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full flex items-center gap-3 p-3 text-sm hover:bg-accent transition-colors ${
                              activeLesson.id === lesson.id
                                ? "bg-violet-500/10 text-violet-500"
                                : ""
                            }`}
                          >
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : lesson.isFree ? (
                              <Play className="h-4 w-4 shrink-0" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-left flex-1 truncate">
                              {lesson.title}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {lesson.duration}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>

            <Separator />

            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4 text-violet-500" />
                Certificate of completion included
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
