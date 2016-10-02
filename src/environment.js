export const ENV = process.env.NODE_ENV || process.env.ENV || 'development'
export const PORT = process.env.NODE_PORT || process.env.PORT || 8082
export const DATADOG_API_KEY = process.env.DATADOG_API_KEY || 'foo'
export const DATADOG_APP_KEY = process.env.DATADOG_APP_KEY || 'bar'
export const REDIS_HOST = process.env.REDIS_PORT_6379_TCP_ADDR
export const REDIS_PORT = process.env.REDIS_PORT_6379_TCP_PORT
