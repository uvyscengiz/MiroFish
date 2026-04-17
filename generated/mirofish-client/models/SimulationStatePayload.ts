/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SimulationStatePayload = {
    config_generated?: boolean;
    config_reasoning?: string;
    created_at: string;
    current_round?: number;
    enable_reddit?: boolean;
    enable_twitter?: boolean;
    entities_count?: number;
    entity_types?: Array<string>;
    error?: (string | null);
    graph_id: string;
    profiles_count?: number;
    project_id: string;
    reddit_status?: string;
    run_instructions?: (Record<string, any> | null);
    simulation_id: string;
    status: string;
    twitter_status?: string;
    updated_at: string;
};

