"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  MessageSquare,
  Play,
  Star,
  Users,
} from "lucide-react";
import type { CourseDetailDTO } from "@/lib/dto";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Lesson = CourseDetailDTO["sections"][number]["lessons"][number];

function fmtLevel(level: CourseDetailDTO["level"]) {
  if (level === "BEGINNER") return "Beginner";
  if (level === "INTERMEDIATE") return "Intermediate";
  return "Advanced";
}

export function CourseClient({ course }: { course: CourseDetailDTO }) {
  const allLessons = useMemo(
    () => course.sections.flatMap((s) => s.lessons.map((l) => ({ ...l, sectionId: s.id }))),
    [course.sections]
  );

  const firstPlayable = allLessons.find((l) => Boolean(l.videoUrl)) ?? allLessons[0];
  const [activeLessonId, setActiveLessonId] = useState<string>(firstPlayable?.id || "");
  const [expandedSections, setExpandedSections] = useState<string[]>(
    course.sections.length ? [course.sections[0]!.id] : []
  );

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) as (Lesson & {
    sectionId: string;
  }) | undefined;

  const completedLessons = 0; // wired in progress todo
  const totalLessons = allLessons.length || 1;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const isLessonLocked = (lesson: Lesson) =>
    !course.entitled && !course.isFree && !lesson.isFree;

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
            {activeLesson?.videoUrl ? (
              <ReactPlayer
                url={activeLesson.videoUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
                light={false}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-white font-medium">This lesson is locked</p>
                  <p className="text-white/70 text-sm mt-1">
                    Purchase the course or start a subscription to watch.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Course Info */}
          <div>
            <Badge variant="secondary" className="mb-3">
              {fmtLevel(course.level)}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-foreground">—</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                — students
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                —
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {allLessons.length} lessons
              </div>
            </div>
          </div>

          <Separator />

          {/* Currently playing */}
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Now Playing
            </p>
            <p className="font-medium">{activeLesson?.title ?? "—"}</p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">About This Course</h2>
            <p className="text-muted-foreground leading-relaxed">{course.description}</p>
          </div>

          <Separator />

          {/* Reviews (wired in later todo) */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviews
            </h2>
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Reviews API is live at <code>/api/reviews</code>. UI wiring comes next.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <div className="text-3xl font-bold">
                {course.isFree || course.price === 0 ? (
                  <span className="text-emerald-500">Free</span>
                ) : (
                  `$${course.price}`
                )}
              </div>
              <Button variant="gradient" size="lg" className="w-full mt-3">
                {course.entitled || course.isFree ? "Start Learning" : "Unlock Access"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                30-day money-back guarantee
              </p>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-medium">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} />
              <p className="text-xs text-muted-foreground mt-2">
                {completedLessons} of {allLessons.length} lessons completed
              </p>
            </CardContent>

            <Separator />

            <CardContent className="pt-4 max-h-[500px] overflow-y-auto">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Content
              </h3>
              <div className="space-y-2">
                {course.sections.map((section) => (
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
                        {section.lessons.map((lesson) => {
                          const locked = isLessonLocked(lesson);
                          const active = activeLessonId === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLessonId(lesson.id)}
                              disabled={locked}
                              className={`w-full flex items-center gap-3 p-3 text-sm hover:bg-accent transition-colors ${
                                active ? "bg-violet-500/10 text-violet-500" : ""
                              } ${locked ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              {active ? (
                                <Play className="h-4 w-4 shrink-0" />
                              ) : lesson.isFree ? (
                                <Play className="h-4 w-4 shrink-0" />
                              ) : locked ? (
                                <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <span className="text-left flex-1 truncate">{lesson.title}</span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {lesson.duration ? `${Math.round(lesson.duration / 60)}m` : "—"}
                              </span>
                            </button>
                          );
                        })}
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

