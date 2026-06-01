import { z } from "zod";

export const toolSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Tool name is required"),
    plan: z.string().min(1, "Plan is required"),
    seats: z.string().min(1, "Seats are required"),
    monthlySpend: z.string().min(1, "Monthly spend is required"),
});

export const auditFormSchema = z.object({
    slug: z.string().optional(),
    teamSize: z.string().min(1, "Team size is required"),
    useCase: z.string().min(1, "Use case is required"),
    tools: z
        .array(toolSchema)
        .min(1, "At least one tool is required"),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;