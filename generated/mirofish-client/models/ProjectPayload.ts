/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OntologyPayload } from './OntologyPayload';
import type { ProjectFileInfo } from './ProjectFileInfo';
export type ProjectPayload = {
    analysis_summary?: (string | null);
    chunk_overlap?: number;
    chunk_size?: number;
    created_at: string;
    error?: (string | null);
    files?: Array<ProjectFileInfo>;
    graph_build_task_id?: (string | null);
    graph_id?: (string | null);
    name: string;
    ontology?: (OntologyPayload | null);
    project_id: string;
    simulation_requirement?: (string | null);
    status: string;
    total_text_length?: number;
    updated_at: string;
};

