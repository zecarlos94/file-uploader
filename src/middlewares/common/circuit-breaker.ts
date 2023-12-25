import { ConsecutiveBreaker, circuitBreaker, handleAll } from "cockatiel";
import config from "src/config";

/* Create a circuit breaker that'll stop calling the executed function for halfOpenAfterMs 
 * if it fails maxExecutionsAttemptsBeforePause times in a row. 
 * This can give time for to recover without getting tons of traffic.
 */
export const circuitBreakerPolicy = circuitBreaker(handleAll, {
    halfOpenAfter: config.circuitBreaker.halfOpenAfterMs,
    breaker: new ConsecutiveBreaker(config.circuitBreaker.maxExecutionsAttemptsBeforePause),
});
