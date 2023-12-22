import config from 'src/config';
import rateLimit, { Options, RateLimitRequestHandler } from 'express-rate-limit';

export class DynamicRateLimiter {
    private static rateLimitRequestHandler: RateLimitRequestHandler = rateLimit({
        limit: config.rateLimiter.limit,
        standardHeaders: true,
        windowMs: config.rateLimiter.windowMs
    });

    static get(): RateLimitRequestHandler {
        return this.rateLimitRequestHandler;
    }

    static set(options: Partial<Options>): RateLimitRequestHandler {
        this.rateLimitRequestHandler = rateLimit(options);
        return this.rateLimitRequestHandler;
    }
}