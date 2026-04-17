/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthEnvelope } from '../models/HealthEnvelope';
import type { OpenAPIDocument } from '../models/OpenAPIDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemService {
    /**
     * Health check
     * Return a lightweight process health payload.
     * @returns HealthEnvelope Health check response.
     * @throws ApiError
     */
    public static healthGet(): CancelablePromise<HealthEnvelope> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Get OpenAPI document
     * Return the live machine-readable OpenAPI contract.
     * @returns OpenAPIDocument Successful response.
     * @throws ApiError
     */
    public static openapiSpecGet(): CancelablePromise<OpenAPIDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/openapi.json',
            errors: {
                404: `Referenced resource was not found.`,
                500: `Unhandled backend error.`,
            },
        });
    }
}
