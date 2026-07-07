import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("Düzgün e-poçt daxil edin");

export const jobSchema = z.object({
  title: z.string().trim().min(4, "Vəzifə adı çox qısadır").max(220),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().trim().min(30, "Təsvir ən azı 30 simvol olmalıdır"),
  responsibilities: z.string().trim().max(5000).optional(),
  requirements: z.string().trim().max(5000).optional(),
  employmentType: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
    "temporary",
    "remote"
  ]),
  experienceLevel: z
    .enum(["entry", "junior", "mid", "senior", "lead", "executive"])
    .optional()
    .or(z.literal("")),
  city: z.string().trim().max(120).optional(),
  isRemote: z.coerce.boolean().default(false),
  salaryMin: z.coerce.number().int().min(0).optional().or(z.nan()),
  salaryMax: z.coerce.number().int().min(0).optional().or(z.nan()),
  salaryHidden: z.coerce.boolean().default(false),
  skills: z.string().trim().max(500).optional()
});

export const applicationSchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().trim().max(4000).optional()
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: emailSchema,
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Mesaj ən azı 10 simvol olmalıdır").max(4000)
});

export type JobInput = z.infer<typeof jobSchema>;
