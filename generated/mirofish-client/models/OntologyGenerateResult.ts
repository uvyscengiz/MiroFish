/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OntologyPayload } from './OntologyPayload';
import type { ProjectFileInfo } from './ProjectFileInfo';
export type OntologyGenerateResult = {
    analysis_summary: string;
    files?: Array<ProjectFileInfo>;
    ontology: OntologyPayload;
    project_id: string;
    project_name: string;
    total_text_length: number;
};

