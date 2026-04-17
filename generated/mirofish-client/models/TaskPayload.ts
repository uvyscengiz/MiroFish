/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskPayload = {
    created_at: string;
    error?: (string | null);
    message?: string;
    metadata?: Record<string, any>;
    progress?: number;
    progress_detail?: Record<string, any>;
    result?: (Record<string, any> | null);
    status: string;
    task_id: string;
    task_type: string;
    updated_at: string;
};

