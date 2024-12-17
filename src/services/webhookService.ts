import { webhookPayloadSchema, WebhookPayload, WebhookError } from '../types/webhook';
import { WEBHOOK_CONFIG } from '../config/webhook';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function validatePayload(payload: Partial<WebhookPayload>): Promise<WebhookPayload> {
  try {
    // Ensure fileUrl is present
    if (!payload.fileUrl) {
      throw new WebhookError(
        'CV URL is required for analysis',
        'VALIDATION_ERROR'
      );
    }

    // Ensure metadata.cvUrl matches fileUrl
    if (payload.metadata?.cvUrl !== payload.fileUrl) {
      throw new WebhookError(
        'CV URL mismatch between payload and metadata',
        'VALIDATION_ERROR'
      );
    }

    const result = webhookPayloadSchema.safeParse(payload);
    
    if (!result.success) {
      console.error('Validation errors:', result.error.format());
      throw new WebhookError(
        'Invalid webhook payload',
        'VALIDATION_ERROR',
        result.error.format()
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof WebhookError) {
      throw error;
    }
    throw new WebhookError(
      'Validation failed',
      'VALIDATION_ERROR',
      error
    );
  }
}

export async function sendAnalysisWebhook(payload: Partial<WebhookPayload>): Promise<void> {
  let attempts = 0;

  // Format payload with required fields
  const formattedPayload = {
    ...payload,
    teamId: payload.teamId || null,
    format: 'json' as const
  };

  while (attempts < WEBHOOK_CONFIG.MAX_RETRIES) {
    try {
      // Validate payload
      const validatedPayload = await validatePayload(formattedPayload);
      
      // Make request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.TIMEOUT);

      const response = await fetch(WEBHOOK_CONFIG.URL, {
        method: 'POST',
        headers: {
          ...WEBHOOK_CONFIG.HEADERS,
          'X-Retry-Attempt': attempts.toString(),
          'X-Preferred-Language': validatedPayload.metadata.preferredLanguage
        },
        body: JSON.stringify(validatedPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new WebhookError(
          errorData?.error || `Webhook failed: ${response.statusText}`,
          'API_ERROR',
          { status: response.status, errorData }
        );
      }

      return;
    } catch (error) {
      attempts++;
      const isWebhookError = error instanceof WebhookError;
      const errorMessage = isWebhookError ? 
        `${error.code}: ${error.message}` :
        'Unknown webhook error';
      
      console.error('Webhook attempt failed:', {
        attempt: attempts,
        error: errorMessage,
        details: isWebhookError ? error.details : error
      });
      
      if (attempts === WEBHOOK_CONFIG.MAX_RETRIES) {
        throw error;
      }

      // Exponential backoff with jitter
      const jitter = Math.random() * 200;
      await delay(WEBHOOK_CONFIG.BASE_RETRY_DELAY * Math.pow(2, attempts - 1) + jitter);
    }
  }
}