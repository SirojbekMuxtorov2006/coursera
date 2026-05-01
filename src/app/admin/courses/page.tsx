"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const coursesData = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    category: "Web Development",
    students: 12400,
    revenue: "$608,000",
    status: "published",
    price: 49.99,
  },
  {
    id: "2",
    title: "Python Data Science",
    category: "Data Science",
    students: 8900,
    revenue: "$534,000",
    status: "published",
    price: 59.99,
  },
  {
    id: "3",
    title: "Advanced TypeScript",
    category: "Programming",
    students: 5600,
    revenue: "Free",
    status: "published",
    price: 0,
  },
  {
    id: "4",
    title: "Rust for Beginners",
    category: "Programming",
    students: 0,
    revenue: "$0",
    status: "draft",
    price: 39.99,
  },
];

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");

  const filtered = coursesData.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage your courses</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Course
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Students
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Revenue
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium text-sm">{course.title}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">
                        {course.category}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {course.students.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {course.revenue}
                    </td>
                    <td className="p-4">
                      {course.status === "published" ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Draft
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {course.price === 0 ? (
                        <span className="text-emerald-500">Free</span>
                      ) : (
                        `$${course.price}`
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
