/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Generic success response envelope used across the API.
 */
export type SuccessEnvelope = {
    /**
     * Operation-specific response payload.
     */
    data?: null;
    /**
     * Optional human-readable success message.
     */
    message?: (string | null);
    success?: boolean;
};

