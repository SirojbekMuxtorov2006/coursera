import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/server-auth";
import { zCreateCourseBody } from "@/lib/validators";
import { jsonError, jsonOk, errorToResponse } from "@/lib/http";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const course = await db.course.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        sections: {
          orderBy: { position: "asc" },
          include: { lessons: { orderBy: { position: "asc" } } },
        },
      },
    });
    if (!course) return jsonError("Course not found", 404);
    return jsonOk(course);
  } catch (e) {
    return errorToResponse(e);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const parsed = zCreateCourseBody.partial().safeParse(await req.json());
    if (!parsed.success) return jsonError("Invalid request", 400, { issues: parsed.error.issues });

    const updated = await db.course.update({
      where: { id },
      data: {
        ...parsed.data,
        price: parsed.data.price ?? undefined,
        isFree: typeof parsed.data.price === "number" ? parsed.data.price <= 0 : undefined,
        authorId: session.user.id,
      },
    });

    return jsonOk(updated);
  } catch (e) {
    return errorToResponse(e);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.course.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch (e) {
    return errorToResponse(e);
  }
}

