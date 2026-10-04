import rateLimit from "express-rate-limit";

// Auth rate limiter (e.g. login, register, password change)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
    code: "TOO_MANY_REQUESTS",
  },
});

// AI symptom analysis rate limiter
export const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 40, // Limit each IP to 40 AI analyses per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI symptom analysis rate limit reached. Please wait a few minutes.",
    code: "AI_RATE_LIMIT",
  },
});

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // Limit each IP to 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

export default {
  authLimiter,
  aiLimiter,
  generalLimiter,
};
