/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportOutlinePayload } from './ReportOutlinePayload';
export type ReportPayload = {
    completed_at?: string;
    created_at?: string;
    error?: (string | null);
    graph_id: string;
    markdown_content?: string;
    outline?: (ReportOutlinePayload | null);
    report_id: string;
    simulation_id: string;
    simulation_requirement: string;
    status: string;
};

