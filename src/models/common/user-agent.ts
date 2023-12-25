export interface UserAgent {
    /**
     * @example "Chrome"
     */
    userAgentBrowserName: string | undefined;

    /**
     * @example "119.0.0.0"
     */
    userAgentBrowserVersion: string | undefined;

    /**
     * @example "Mac OS"
     */
    userAgentOsName: string | undefined;

    /**
     * @example "10.15.7"
     */
    userAgentOsVersion: string | undefined;
}