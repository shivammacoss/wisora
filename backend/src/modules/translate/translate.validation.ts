import { z } from 'zod';

/** Body: strings to translate + the target language. */
export const translateSchema = z.object({
  target: z.enum(['en', 'es', 'fr', 'ur', 'ru']),
  texts: z.array(z.string().max(8000)).max(300),
});
