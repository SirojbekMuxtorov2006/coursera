import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/server-auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin().catch(() => null);
  if (!session) redirect("/");
  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } },
      },
    },
  });

  if (!course) redirect("/admin/courses");

  async function updateCourse(formData: FormData) {
    "use server";
    await requireAdmin();

    const title = String(formData.get("title") || "").trim();
    const shortDesc = String(formData.get("shortDesc") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const price = Number(formData.get("price") || 0);
    const isPublished = formData.get("isPublished") === "on";

    await db.course.update({
      where: { id },
      data: {
        title,
        shortDesc: shortDesc || null,
        description,
        category: category || null,
        price,
        isFree: price <= 0,
        isPublished,
      },
    });

    redirect(`/admin/courses/${id}/edit`);
  }

  async function addSection(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = String(formData.get("title") || "").trim();
    const position = await db.section.count({ where: { courseId: id } });
    await db.section.create({ data: { courseId: id, title: title || "New section", position } });
    redirect(`/admin/courses/${id}/edit`);
  }

  async function addLesson(formData: FormData) {
    "use server";
    await requireAdmin();
    const sectionId = String(formData.get("sectionId") || "");
    const title = String(formData.get("title") || "").trim();
    const position = await db.lesson.count({ where: { sectionId } });
    await db.lesson.create({
      data: { sectionId, title: title || "New lesson", position, isFree: false },
    });
    redirect(`/admin/courses/${id}/edit`);
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit course</h1>
          <p className="text-muted-foreground">Build content, then publish.</p>
        </div>
        <Link href="/admin/courses">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form action={updateCourse} className="space-y-4 rounded-xl border p-5 bg-card">
          <h2 className="font-semibold">Details</h2>
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              name="title"
              defaultValue={course.title}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Short description</label>
            <input
              name="shortDesc"
              defaultValue={course.shortDesc ?? ""}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Used on cards and SEO"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              name="category"
              defaultValue={course.category ?? ""}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price (USD)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={course.price}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set to 0 for free courses.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              defaultValue={course.description}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm min-h-40"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublished" defaultChecked={course.isPublished} />
            Published
          </label>

          <Button variant="gradient" type="submit">
            Save
          </Button>
        </form>

        <div className="space-y-4 rounded-xl border p-5 bg-card">
          <h2 className="font-semibold">Content</h2>

          <form action={addSection} className="flex gap-2">
            <input
              name="title"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="New section title"
            />
            <Button type="submit" variant="outline">
              Add section
            </Button>
          </form>

          <form action={addLesson} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <select
              name="sectionId"
              className="rounded-md border bg-background px-3 py-2 text-sm"
              required
              defaultValue={course.sections[0]?.id ?? ""}
            >
              {course.sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <input
              name="title"
              className="md:col-span-2 rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="New lesson title"
            />
            <div className="md:col-span-3">
              <Button type="submit" variant="outline">
                Add lesson
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            {course.sections.map((section) => (
              <div key={section.id} className="rounded-lg border overflow-hidden">
                <div className="px-3 py-2 bg-muted/40 text-sm font-medium">
                  {section.position + 1}. {section.title}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({section.lessons.length} lessons)
                  </span>
                </div>
                <div className="divide-y">
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className="px-3 py-2 text-sm flex items-center justify-between">
                      <span className="truncate">
                        {lesson.position + 1}. {lesson.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {lesson.isFree ? "Free" : "Premium"}
                      </span>
                    </div>
                  ))}
                  {section.lessons.length === 0 && (
                    <div className="px-3 py-3 text-sm text-muted-foreground">No lessons yet.</div>
                  )}
                </div>
              </div>
            ))}
            {course.sections.length === 0 && (
              <div className="text-sm text-muted-foreground">Add a section to begin.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

