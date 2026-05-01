import { requireUser } from "@/lib/server-auth";
import { jsonError, jsonOk, errorToResponse } from "@/lib/http";
import { z } from "zod";

const zBody = z.object({
  message: z.string().min(1).max(4000),
  context: z
    .object({
      courseId: z.string().optional(),
      lessonId: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  try {
    await requireUser();

    const parsed = zBody.safeParse(await req.json());
    if (!parsed.success) return jsonError("Invalid request", 400, { issues: parsed.error.issues });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonOk({
        reply:
          "AI is not configured yet. Set OPENAI_API_KEY to enable responses.",
      });
    }

    // Minimal OpenAI-compatible chat call. Works with many gateways that mimic OpenAI.
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful programming course assistant. Be concise, correct, and educational.",
          },
          { role: "user", content: parsed.data.message },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return jsonError("AI request failed", 502, { details: text.slice(0, 500) });
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim() || "No response.";

    return jsonOk({ reply });
  } catch (e) {
    return errorToResponse(e);
  }
}

