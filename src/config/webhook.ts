export const WEBHOOK_CONFIG = {
  URL: 'https://hook.eu2.make.com/vv8c3du4378lacrvkof8nvg4jb5fgc11',
  MAX_RETRIES: 3,
  BASE_RETRY_DELAY: 1000,
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Source': 'SandraHR-Web'
  }
} as const;