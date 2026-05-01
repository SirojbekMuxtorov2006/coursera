"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const overviewStats = [
  {
    title: "Total Users",
    value: "12,450",
    change: "+12.5%",
    trending: "up",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Active Courses",
    value: "48",
    change: "+3",
    trending: "up",
    icon: BookOpen,
    color: "text-violet-500",
  },
  {
    title: "Revenue (MTD)",
    value: "$24,580",
    change: "+18.2%",
    trending: "up",
    icon: DollarSign,
    color: "text-emerald-500",
  },
  {
    title: "Enrollments",
    value: "1,234",
    change: "-2.1%",
    trending: "down",
    icon: TrendingUp,
    color: "text-orange-500",
  },
];

const recentActivity = [
  { id: 1, action: "New user registered", user: "Sarah Chen", time: "2 min ago" },
  { id: 2, action: "Course published", user: "Admin", time: "15 min ago" },
  { id: 3, action: "New purchase", user: "Marcus Johnson", time: "1 hour ago" },
  { id: 4, action: "Review submitted", user: "Emily Rodriguez", time: "2 hours ago" },
  { id: 5, action: "Certificate issued", user: "David Kim", time: "3 hours ago" },
];

export default function AdminDashboard() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Overview of your platform performance
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewStats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-sm">
                  {stat.trending === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trending === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Courses</CardTitle>
              <CardDescription>By enrollment count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Full-Stack Web Dev", enrollments: 12400, revenue: "$608K" },
                  { name: "Python Data Science", enrollments: 8900, revenue: "$534K" },
                  { name: "Next.js Masterclass", enrollments: 9800, revenue: "Free" },
                  { name: "Advanced TypeScript", enrollments: 5600, revenue: "Free" },
                  { name: "React Native Mobile", enrollments: 7200, revenue: "$288K" },
                ].map((course, i) => (
                  <div
                    key={course.name}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{course.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.enrollments.toLocaleString()} students
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{course.revenue}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
