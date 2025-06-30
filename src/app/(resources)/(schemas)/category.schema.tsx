import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
})

export const CreateCategoryDefaultValues = {
  name: "",
}

export type CreateCategoryFormValues = z.infer<typeof CreateCategorySchema>