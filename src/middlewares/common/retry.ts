import { ExponentialBackoff, handleAll, retry } from 'cockatiel';
import config from 'src/config';

// Create a retry policy that'll try whatever function we execute # times with a randomized exponential backoff.
export const retryPolicy = retry(
    handleAll, 
    { 
        backoff: new ExponentialBackoff(),
        maxAttempts: config.retries.maxAttempts, 
    }
);
