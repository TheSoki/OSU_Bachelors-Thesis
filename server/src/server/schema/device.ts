import { z } from "zod";

export const deviceSchema = z.object({
    id: z.string(),
});

export const deviceCreateSchema = z.object({
    buildingId: z.string().min(1).max(255),
    roomId: z.string().min(1).max(255),
});

export const deviceUpdateSchema = z.object({
    id: z.string(),
    buildingId: z.string().min(1).max(255).optional(),
    roomId: z.string().min(1).max(255).optional(),
});