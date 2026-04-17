/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BuildGraphRequest } from '../models/BuildGraphRequest';
import type { BuildGraphResponse } from '../models/BuildGraphResponse';
import type { GenerateOntologyForm } from '../models/GenerateOntologyForm';
import type { GraphDataResponse } from '../models/GraphDataResponse';
import type { MessageResponse } from '../models/MessageResponse';
import type { OntologyGenerateResponse } from '../models/OntologyGenerateResponse';
import type { ProjectListResponse } from '../models/ProjectListResponse';
import type { ProjectMessageResponse } from '../models/ProjectMessageResponse';
import type { ProjectResponse } from '../models/ProjectResponse';
import type { TaskListResponse } from '../models/TaskListResponse';
import type { TaskResponse } from '../models/TaskResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GraphService {
    /**
     * Start graph build
     * 接口2：根据project_id构建图谱
     *
     * 请求（JSON）：
     * {
         * "project_id": "proj_xxxx",  // 必填，来自接口1
         * "graph_name": "图谱名称",    // 可选
         * "chunk_size": 500,          // 可选，默认500
         * "chunk_overlap": 50         // 可选，默认50
         * }
         *
         * 返回：
         * {
             * "success": true,
             * "data": {
                 * "project_id": "proj_xxxx",
                 * "task_id": "task_xxxx",
                 * "message": "图谱构建任务已启动"
                 * }
                 * }
                 * @param requestBody
                 * @returns BuildGraphResponse Successful response.
                 * @throws ApiError
                 */
                public static graphBuildGraphPost(
                    requestBody: BuildGraphRequest,
                ): CancelablePromise<BuildGraphResponse> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/graph/build',
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Request validation or state error.`,
                            404: `Referenced resource was not found.`,
                            500: `Unhandled backend error.`,
                        },
                    });
                }
                /**
                 * Get graph data
                 * 获取图谱数据（节点和边）
                 * @param graphId
                 * @returns GraphDataResponse Successful response.
                 * @throws ApiError
                 */
                public static graphGetGraphDataGet(
                    graphId: string,
                ): CancelablePromise<GraphDataResponse> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/graph/data/{graph_id}',
                        path: {
                            'graph_id': graphId,
                        },
                        errors: {
                            404: `Referenced resource was not found.`,
                            500: `Unhandled backend error.`,
                        },
                    });
                }
                /**
                 * Delete graph
                 * 删除Zep图谱
                 * @param graphId
                 * @returns MessageResponse Successful response.
                 * @throws ApiError
                 */
                public static graphDeleteGraphDelete(
                    graphId: string,
                ): CancelablePromise<MessageResponse> {
                    return __request(OpenAPI, {
                        method: 'DELETE',
                        url: '/api/graph/delete/{graph_id}',
                        path: {
                            'graph_id': graphId,
                        },
                        errors: {
                            404: `Referenced resource was not found.`,
                            500: `Unhandled backend error.`,
                        },
                    });
                }
                /**
                 * Generate ontology from uploaded documents
                 * 接口1：上传文件，分析生成本体定义
                 *
                 * 请求方式：multipart/form-data
                 *
                 * 参数：
                 * files: 上传的文件（PDF/MD/TXT），可多个
                 * simulation_requirement: 模拟需求描述（必填）
                 * project_name: 项目名称（可选）
                 * additional_context: 额外说明（可选）
                 *
                 * 返回：
                 * {
                     * "success": true,
                     * "data": {
                         * "project_id": "proj_xxxx",
                         * "ontology": {
                             * "entity_types": [...],
                             * "edge_types": [...],
                             * "analysis_summary": "..."
                             * },
                             * "files": [...],
                             * "total_text_length": 12345
                             * }
                             * }
                             * @param formData
                             * @returns OntologyGenerateResponse Successful response.
                             * @throws ApiError
                             */
                            public static graphGenerateOntologyPost(
                                formData: GenerateOntologyForm,
                            ): CancelablePromise<OntologyGenerateResponse> {
                                return __request(OpenAPI, {
                                    method: 'POST',
                                    url: '/api/graph/ontology/generate',
                                    formData: formData,
                                    mediaType: 'multipart/form-data',
                                    errors: {
                                        400: `Request validation or state error.`,
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                            /**
                             * List projects
                             * 列出所有项目
                             * @param limit Maximum number of projects to return.
                             * @returns ProjectListResponse Successful response.
                             * @throws ApiError
                             */
                            public static graphListProjectsGet(
                                limit: number = 50,
                            ): CancelablePromise<ProjectListResponse> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/graph/project/list',
                                    query: {
                                        'limit': limit,
                                    },
                                    errors: {
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                            /**
                             * Delete project
                             * 删除项目
                             * @param projectId
                             * @returns MessageResponse Successful response.
                             * @throws ApiError
                             */
                            public static graphDeleteProjectDelete(
                                projectId: string,
                            ): CancelablePromise<MessageResponse> {
                                return __request(OpenAPI, {
                                    method: 'DELETE',
                                    url: '/api/graph/project/{project_id}',
                                    path: {
                                        'project_id': projectId,
                                    },
                                    errors: {
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                            /**
                             * Get project detail
                             * 获取项目详情
                             * @param projectId
                             * @returns ProjectResponse Successful response.
                             * @throws ApiError
                             */
                            public static graphGetProjectGet(
                                projectId: string,
                            ): CancelablePromise<ProjectResponse> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/graph/project/{project_id}',
                                    path: {
                                        'project_id': projectId,
                                    },
                                    errors: {
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                            /**
                             * Reset project state
                             * 重置项目状态（用于重新构建图谱）
                             * @param projectId
                             * @param requestBody
                             * @returns ProjectMessageResponse Successful response.
                             * @throws ApiError
                             */
                            public static graphResetProjectPost(
                                projectId: string,
                                requestBody: Record<string, any>,
                            ): CancelablePromise<ProjectMessageResponse> {
                                return __request(OpenAPI, {
                                    method: 'POST',
                                    url: '/api/graph/project/{project_id}/reset',
                                    path: {
                                        'project_id': projectId,
                                    },
                                    body: requestBody,
                                    mediaType: 'application/json',
                                    errors: {
                                        400: `Request validation or state error.`,
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                            /**
                             * Get graph task status
                             * 查询任务状态
                             * @param taskId
                             * @returns TaskResponse Successful response.
                             * @throws ApiError
                             */
                            public static graphGetTaskGet(
                                taskId: string,
                            ): CancelablePromise<TaskResponse> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/graph/task/{task_id}',
                                    path: {
                                        'task_id': taskId,
                                    },
                                    errors: {
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                            /**
                             * List graph tasks
                             * 列出所有任务
                             * @returns TaskListResponse Successful response.
                             * @throws ApiError
                             */
                            public static graphListTasksGet(): CancelablePromise<TaskListResponse> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/graph/tasks',
                                    errors: {
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                        }
