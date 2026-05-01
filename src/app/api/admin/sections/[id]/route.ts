import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/server-auth";
import { jsonError, jsonOk, errorToResponse } from "@/lib/http";
import { z } from "zod";

const zPatch = z.object({
  title: z.string().min(1).max(200).optional(),
  position: z.number().int().nonnegative().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const parsed = zPatch.safeParse(await req.json());
    if (!parsed.success) return jsonError("Invalid request", 400, { issues: parsed.error.issues });

    const updated = await db.section.update({
      where: { id },
      data: parsed.data,
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
    await db.section.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch (e) {
    return errorToResponse(e);
  }
}

