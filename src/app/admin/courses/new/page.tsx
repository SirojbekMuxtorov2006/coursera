import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/server-auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function NewCoursePage() {
  async function createCourse(formData: FormData) {
    "use server";
    const session = await requireAdmin();
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "").trim();

    const slug = slugify(title || `course-${Date.now()}`);

    const course = await db.course.create({
      data: {
        title: title || "Untitled course",
        slug,
        description: description || "Describe your course...",
        shortDesc: null,
        thumbnail: null,
        price: 0,
        isFree: true,
        isPublished: false,
        level: "BEGINNER",
        category: category || null,
        tags: [],
        authorId: session.user.id,
      },
    });

    redirect(`/admin/courses/${course.id}/edit`);
  }

  const session = await requireAdmin().catch(() => null);
  if (!session) redirect("/");

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create course</h1>
          <p className="text-muted-foreground">Start with basics, then add lessons.</p>
        </div>
        <Link href="/admin/courses">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <form action={createCourse} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="e.g. Modern Next.js for Builders"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <input
            name="category"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="e.g. Web Development"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm min-h-32"
            placeholder="What will learners achieve?"
          />
        </div>

        <Button variant="gradient" type="submit">
          Create and continue
        </Button>
      </form>
    </div>
  );
}

