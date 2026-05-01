import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/server-auth";
import { jsonCreated, jsonError, errorToResponse } from "@/lib/http";
import { z } from "zod";

const zBody = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1).max(200),
  position: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const parsed = zBody.safeParse(await req.json());
    if (!parsed.success) return jsonError("Invalid request", 400, { issues: parsed.error.issues });

    const section = await db.section.create({
      data: parsed.data,
    });

    return jsonCreated(section);
  } catch (e) {
    return errorToResponse(e);
  }
}

