
import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  type: z.enum(['text', 'image'], {
    required_error: 'Tipo é obrigatório',
  }),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  duration: z.coerce.number().min(1, 'Duração mínima é 1 segundo'),
  active: z.boolean().default(true),
  publish_start: z.string().default(() => new Date().toISOString()),
  publish_end: z.string().nullable().optional(),
  course: z.string().nullable().default('all'),
});

export type FormData = z.infer<typeof formSchema>;
