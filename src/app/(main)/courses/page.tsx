"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const allCourses = [
  {
    id: "1",
    slug: "fullstack-web-dev",
    title: "Full-Stack Web Development with React & Node.js",
    description: "Build modern web apps from scratch with the MERN stack.",
    price: 49.99,
    rating: 4.8,
    students: 12400,
    level: "Intermediate",
    category: "Web Development",
    author: "John Doe",
    lessons: 48,
  },
  {
    id: "2",
    slug: "python-data-science",
    title: "Python for Data Science & Machine Learning",
    description:
      "Master Python, Pandas, NumPy, and build ML models from scratch.",
    price: 59.99,
    rating: 4.9,
    students: 8900,
    level: "Beginner",
    category: "Data Science",
    author: "Jane Smith",
    lessons: 62,
  },
  {
    id: "3",
    slug: "advanced-typescript",
    title: "Advanced TypeScript & Design Patterns",
    description:
      "Level up your TypeScript skills with real-world design patterns.",
    price: 0,
    rating: 4.7,
    students: 5600,
    level: "Advanced",
    category: "Programming",
    author: "Alex Johnson",
    lessons: 35,
  },
  {
    id: "4",
    slug: "react-native-mobile",
    title: "React Native: Build Mobile Apps",
    description: "Create cross-platform mobile apps with React Native and Expo.",
    price: 39.99,
    rating: 4.6,
    students: 7200,
    level: "Intermediate",
    category: "Mobile Development",
    author: "Maria Garcia",
    lessons: 40,
  },
  {
    id: "5",
    slug: "devops-docker-k8s",
    title: "DevOps with Docker & Kubernetes",
    description: "Master containerization, orchestration, and CI/CD pipelines.",
    price: 69.99,
    rating: 4.8,
    students: 4300,
    level: "Advanced",
    category: "DevOps",
    author: "David Kim",
    lessons: 55,
  },
  {
    id: "6",
    slug: "nextjs-masterclass",
    title: "Next.js 14 Complete Masterclass",
    description:
      "Build production-ready apps with Next.js, Server Components, and more.",
    price: 0,
    rating: 4.9,
    students: 9800,
    level: "Intermediate",
    category: "Web Development",
    author: "Sarah Wilson",
    lessons: 72,
  },
];

const categories = [
  "All",
  "Web Development",
  "Data Science",
  "Programming",
  "Mobile Development",
  "DevOps",
];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const filtered = allCourses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || c.category === category;
    const matchLevel = level === "All" || c.level === level;
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold">Browse Courses</h1>
        <p className="text-muted-foreground mt-2">
          Discover {allCourses.length}+ courses to boost your skills
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <Button
              key={c}
              variant={category === c ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(c)}
              className={
                category === c
                  ? "bg-violet-600 hover:bg-violet-700"
                  : ""
              }
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <SlidersHorizontal className="h-4 w-4 mt-1.5 text-muted-foreground" />
        {levels.map((l) => (
          <Button
            key={l}
            variant={level === l ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLevel(l)}
          >
            {l}
          </Button>
        ))}
      </div>

      {/* Results */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {filtered.length} course{filtered.length !== 1 && "s"}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
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
                  {course.price === 0 && (
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
                      {course.rating}
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
                    {course.lessons} lessons
                  </div>
                  <div className="text-lg font-bold">
                    {course.price === 0 ? (
                      <span className="text-emerald-500">Free</span>
                    ) : (
                      `$${course.price}`
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
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
