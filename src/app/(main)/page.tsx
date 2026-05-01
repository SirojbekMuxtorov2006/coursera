"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Play,
  Star,
  Users,
  BookOpen,
  Award,
  Zap,
  Check,
  Code,
  Monitor,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] },
  }),
};

const featuredCourses = [
  {
    id: "1",
    title: "Full-Stack Web Development with React & Node.js",
    description: "Build modern web apps from scratch with the MERN stack.",
    thumbnail: "/api/placeholder/400/225",
    price: 49.99,
    rating: 4.8,
    students: 12400,
    level: "Intermediate",
    category: "Web Development",
    author: "John Doe",
  },
  {
    id: "2",
    title: "Python for Data Science & Machine Learning",
    description:
      "Master Python, Pandas, NumPy, and build ML models from scratch.",
    thumbnail: "/api/placeholder/400/225",
    price: 59.99,
    rating: 4.9,
    students: 8900,
    level: "Beginner",
    category: "Data Science",
    author: "Jane Smith",
  },
  {
    id: "3",
    title: "Advanced TypeScript & Design Patterns",
    description:
      "Level up your TypeScript skills with real-world design patterns.",
    thumbnail: "/api/placeholder/400/225",
    price: 0,
    rating: 4.7,
    students: 5600,
    level: "Advanced",
    category: "Programming",
    author: "Alex Johnson",
  },
];

const stats = [
  { icon: Users, value: "50K+", label: "Active Learners" },
  { icon: BookOpen, value: "200+", label: "Courses" },
  { icon: Award, value: "15K+", label: "Certificates Issued" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content:
      "Coursa completely transformed my career. The courses are incredibly well-structured and the instructors are world-class.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Freelance Developer",
    content:
      "I went from zero coding knowledge to building full-stack apps in just 6 months. The interactive lessons make learning so engaging.",
    avatar: "MJ",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist at Meta",
    content:
      "The data science track is phenomenal. Real-world projects, clear explanations, and a supportive community.",
    avatar: "ER",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Access to free courses",
      "Community forums",
      "Basic progress tracking",
      "Mobile access",
    ],
    cta: "Start Learning",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious learners",
    features: [
      "All free features",
      "Unlimited course access",
      "Certificates of completion",
      "AI code assistant",
      "Code playground",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For teams & organizations",
    features: [
      "All Pro features",
      "Up to 10 team members",
      "Admin dashboard",
      "Team analytics",
      "Custom learning paths",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute -bottom-20 left-1/2 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-1.5 text-sm border border-violet-500/20 bg-violet-500/10 text-violet-400"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                New: AI-Powered Code Assistant
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
            >
              Learn to Code.
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Build the Future.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Master programming with expert-led courses, interactive code
              playgrounds, and AI-powered assistance. From beginner to
              professional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth/register">
                <Button variant="gradient" size="xl" className="group">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="xl" className="gap-2">
                  <Play className="h-4 w-4" />
                  Browse Courses
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-violet-500" />
                <div className="text-2xl md:text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ─────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold"
            >
              Featured Courses
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            >
              Hand-picked courses to accelerate your learning journey
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
              >
                <Card className="group hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
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
                  <CardFooter className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      by {course.author}
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
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="group">
                View All Courses
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold"
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground max-w-2xl mx-auto"
            >
              A complete learning platform packed with powerful tools
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Monitor,
                title: "HD Video Lessons",
                desc: "Crystal-clear video content with professional production quality",
              },
              {
                icon: Code,
                title: "Code Playground",
                desc: "Write and run code directly in your browser with our built-in IDE",
              },
              {
                icon: Sparkles,
                title: "AI Assistant",
                desc: "Get instant help from our AI-powered coding assistant",
              },
              {
                icon: Award,
                title: "Certificates",
                desc: "Earn verified certificates to showcase your skills",
              },
              {
                icon: Zap,
                title: "Progress Tracking",
                desc: "Track your learning journey with detailed analytics",
              },
              {
                icon: Users,
                title: "Community",
                desc: "Join a vibrant community of learners and mentors",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="h-full hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 border-transparent hover:border-violet-500/20">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-violet-500" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold"
            >
              Loved by Developers
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground"
            >
              See what our learners have to say
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed">{t.content}</p>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground"
            >
              Start free, upgrade when you&apos;re ready
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
              >
                <Card
                  className={`h-full relative ${
                    plan.popular
                      ? "border-violet-500 shadow-lg shadow-violet-500/10"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-violet-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={plan.popular ? "gradient" : "outline"}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-white/10 blur-[80px]" />
              <div className="absolute bottom-0 left-0 h-[200px] w-[200px] rounded-full bg-white/10 blur-[60px]" />
            </div>
            <motion.div
              variants={fadeUp}
              custom={0}
              className="relative px-8 py-16 md:py-20 text-center text-white"
            >
              <h2 className="text-3xl md:text-5xl font-bold">
                Ready to Start Learning?
              </h2>
              <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                Join thousands of developers who are already building the future
                with Coursa.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register">
                  <Button
                    size="xl"
                    className="bg-white text-violet-700 hover:bg-white/90 shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
