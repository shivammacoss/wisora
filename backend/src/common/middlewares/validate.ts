import type { RequestHandler } from 'express';
import type { AnyZodObject, ZodEffects } from 'zod';

type Schema = AnyZodObject | ZodEffects<AnyZodObject>;

/**
 * Validates and coerces req.body / req.params / req.query against a Zod schema.
 * On success the parsed values replace the originals (typed + sanitized).
 * On failure the ZodError propagates to the central error handler (→ 422).
 *
 * Usage: router.post('/', validate({ body: createUserSchema }), controller.create)
 */
export const validate =
  (schemas: { body?: Schema; params?: Schema; query?: Schema }): RequestHandler =>
  async (req, _res, next) => {
    try {
      if (schemas.body) req.body = await schemas.body.parseAsync(req.body);
      if (schemas.params) req.params = await schemas.params.parseAsync(req.params);
      if (schemas.query) req.query = await schemas.query.parseAsync(req.query);
      next();
    } catch (err) {
      next(err);
    }
  };
