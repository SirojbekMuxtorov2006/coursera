import crypto from "crypto";
import { requireAdmin } from "@/lib/server-auth";
import { jsonError, jsonOk, errorToResponse } from "@/lib/http";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_FOLDER || "coursa";

    if (!cloudName || !apiKey || !apiSecret) {
      return jsonError("Cloudinary is not configured", 500);
    }

    const body = (await req.json().catch(() => ({}))) as { publicId?: string; resourceType?: string };
    const timestamp = Math.floor(Date.now() / 1000);

    // Cloudinary signature: sha1 of sorted params joined by '&' + api_secret
    // We sign only what we send to the upload request.
    const params: Record<string, string | number> = {
      folder,
      timestamp,
    };
    if (body.publicId) params.public_id = body.publicId;

    const toSign = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&");

    const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

    return jsonOk({
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature,
      publicId: body.publicId || null,
    });
  } catch (e) {
    return errorToResponse(e);
  }
}

