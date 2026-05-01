import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/server-auth";
import { jsonCreated, jsonError, errorToResponse } from "@/lib/http";
import { z } from "zod";

const zBody = z.object({
  sectionId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  content: z.string().optional().nullable(),
  duration: z.number().int().nonnegative().optional().nullable(),
  position: z.number().int().nonnegative(),
  isFree: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const parsed = zBody.safeParse(await req.json());
    if (!parsed.success) return jsonError("Invalid request", 400, { issues: parsed.error.issues });

    const lesson = await db.lesson.create({
      data: {
        ...parsed.data,
        isFree: parsed.data.isFree ?? false,
      },
    });

    return jsonCreated(lesson);
  } catch (e) {
    return errorToResponse(e);
  }
}

