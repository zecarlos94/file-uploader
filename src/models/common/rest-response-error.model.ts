export interface RestResponseError<T extends string> {
    /**
     * @example "required property 'pingMessage' is missing"
     */
    errorMessage: string;
    
    /**
     * @example "JSON_Schema_Validation"
     */
    type: T;
}