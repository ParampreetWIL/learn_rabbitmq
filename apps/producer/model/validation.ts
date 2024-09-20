import { z } from "zod"


export const task = z.object({
    title: z.string().max(20),
    desc: z.string().max(50).optional().default(""),
    tags: z.array(z.string()).max(10).optional().default([])
})