import { z } from 'zod';

// File metadata validation schema
export const fileMetadataSchema = z.object({
  fileName: z.string().min(1, 'Filename is required'),
  fileSize: z.number().positive('File size must be positive'),
  fileType: z.string().min(1, 'File type is required'),
  cvUrl: z.string().url('Valid CV URL is required'),
  preferredLanguage: z.enum(['en', 'fr']).default('en')
}).strict();

// Main webhook payload schema
export const webhookPayloadSchema = z.object({
  fileUrl: z.string().url('Valid file URL is required'),
  userId: z.string().min(1, 'User ID is required'),
  teamId: z.string().nullable(),
  companyId: z.string().min(1, 'Company ID is required'),
  userName: z.string().min(1, 'User name is required'),
  userEmail: z.string().email('Invalid email address'),
  metadata: fileMetadataSchema,
  format: z.literal('json').optional()
}).strict();

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;

export class WebhookError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'WebhookError';
  }
}