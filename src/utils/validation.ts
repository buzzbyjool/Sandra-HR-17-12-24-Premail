import { z } from 'zod';

export function validateSchema<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const formattedError = result.error.format();
    throw new Error(
      `Validation failed: ${JSON.stringify(formattedError, null, 2)}`
    );
  }
  
  return result.data;
}