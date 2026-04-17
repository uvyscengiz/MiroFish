/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Success envelope variant for message-only responses.
 */
export type MessageEnvelope = {
    /**
     * Optional supplemental payload.
     */
    data?: null;
    /**
     * Human-readable success message.
     */
    message: string;
    success?: boolean;
};

