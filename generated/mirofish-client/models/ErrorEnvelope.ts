/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Error response envelope used by the existing handlers.
 */
export type ErrorEnvelope = {
    /**
     * Primary error detail.
     */
    error: string;
    /**
     * Optional human-readable error message.
     */
    message?: (string | null);
    success?: boolean;
    /**
     * Optional traceback returned by existing 500 handlers.
     */
    traceback?: (string | null);
};

