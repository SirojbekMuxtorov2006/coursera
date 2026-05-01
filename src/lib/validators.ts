import { z } from "zod";

export const zCourseLevel = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export const zRegisterBody = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export const zCreateCourseBody = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  description: z.string().min(10),
  shortDesc: z.string().max(400).optional().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  price: z.number().nonnegative().optional(),
  level: zCourseLevel.optional(),
  category: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().max(50)).optional(),
  isPublished: z.boolean().optional(),
});

export const zProgressUpsertBody = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
});

export const zCheckoutBody = z.object({
  priceType: z.enum(["one-time", "monthly", "yearly"]),
  courseId: z.string().min(1).optional(),
});

export const zCertificateCreateBody = z.object({
  courseId: z.string().min(1),
});

