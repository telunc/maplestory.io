export const ENV = process.env.NODE_ENV || process.env.ENV || 'development';
export const PORT = process.env.NODE_PORT || process.env.PORT || 3001;
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/test'
export const SENTRY_DSN = process.env.SENTRY_DSN || null;
export const DATADOG_API_KEY = process.env.DATADOG_API_KEY || 'foo';
export const DATADOG_APP_KEY = process.env.DATADOG_APP_KEY || 'bar';
