/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSimulationRequest } from '../models/CreateSimulationRequest';
import type { SimulationListResponse } from '../models/SimulationListResponse';
import type { SimulationPrepareStatusRequest } from '../models/SimulationPrepareStatusRequest';
import type { SimulationPrepareStatusResponse } from '../models/SimulationPrepareStatusResponse';
import type { SimulationResponse } from '../models/SimulationResponse';
import type { SimulationRunStatusResponse } from '../models/SimulationRunStatusResponse';
import type { SuccessEnvelope } from '../models/SuccessEnvelope';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SimulationService {
    /**
     * 关闭模拟环境
     * 关闭模拟环境
     *
     * 向模拟发送关闭环境命令，使其优雅退出等待命令模式。
     *
     * 注意：这不同于 /stop 接口，/stop 会强制终止进程，
     * 而此接口会让模拟优雅地关闭环境并退出。
     *
     * 请求（JSON）：
     * {
         * "simulation_id": "sim_xxxx",  // 必填，模拟ID
         * "timeout": 30                  // 可选，超时时间（秒），默认30
         * }
         *
         * 返回：
         * {
             * "success": true,
             * "data": {
                 * "message": "环境关闭命令已发送",
                 * "result": {...},
                 * "timestamp": "2025-12-08T10:00:01"
                 * }
                 * }
                 * @param requestBody
                 * @returns SuccessEnvelope Successful response.
                 * @throws ApiError
                 */
                public static simulationCloseSimulationEnvPost(
                    requestBody: Record<string, any>,
                ): CancelablePromise<SuccessEnvelope> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/simulation/close-env',
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
                 * Create simulation
                 * 创建新的模拟
                 *
                 * 注意：max_rounds等参数由LLM智能生成，无需手动设置
                 *
                 * 请求（JSON）：
                 * {
                     * "project_id": "proj_xxxx",      // 必填
                     * "graph_id": "mirofish_xxxx",    // 可选，如不提供则从project获取
                     * "enable_twitter": true,          // 可选，默认true
                     * "enable_reddit": true            // 可选，默认true
                     * }
                     *
                     * 返回：
                     * {
                         * "success": true,
                         * "data": {
                             * "simulation_id": "sim_xxxx",
                             * "project_id": "proj_xxxx",
                             * "graph_id": "mirofish_xxxx",
                             * "status": "created",
                             * "enable_twitter": true,
                             * "enable_reddit": true,
                             * "created_at": "2025-12-01T10:00:00"
                             * }
                             * }
                             * @param requestBody
                             * @returns SimulationResponse Successful response.
                             * @throws ApiError
                             */
                            public static simulationCreateSimulationPost(
                                requestBody: CreateSimulationRequest,
                            ): CancelablePromise<SimulationResponse> {
                                return __request(OpenAPI, {
                                    method: 'POST',
                                    url: '/api/simulation/create',
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
                             * 获取图谱中的所有实体（已过滤）
                             * 获取图谱中的所有实体（已过滤）
                             *
                             * 只返回符合预定义实体类型的节点（Labels不只是Entity的节点）
                             *
                             * Query参数：
                             * entity_types: 逗号分隔的实体类型列表（可选，用于进一步过滤）
                             * enrich: 是否获取相关边信息（默认true）
                             * @param graphId
                             * @returns SuccessEnvelope Successful response.
                             * @throws ApiError
                             */
                            public static simulationGetGraphEntitiesGet(
                                graphId: string,
                            ): CancelablePromise<SuccessEnvelope> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/simulation/entities/{graph_id}',
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
                             * 获取指定类型的所有实体
                             * 获取指定类型的所有实体
                             * @param graphId
                             * @param entityType
                             * @returns SuccessEnvelope Successful response.
                             * @throws ApiError
                             */
                            public static simulationGetEntitiesByTypeGet(
                                graphId: string,
                                entityType: string,
                            ): CancelablePromise<SuccessEnvelope> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/simulation/entities/{graph_id}/by-type/{entity_type}',
                                    path: {
                                        'graph_id': graphId,
                                        'entity_type': entityType,
                                    },
                                    errors: {
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                            /**
                             * 获取单个实体的详细信息
                             * 获取单个实体的详细信息
                             * @param graphId
                             * @param entityUuid
                             * @returns SuccessEnvelope Successful response.
                             * @throws ApiError
                             */
                            public static simulationGetEntityDetailGet(
                                graphId: string,
                                entityUuid: string,
                            ): CancelablePromise<SuccessEnvelope> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/simulation/entities/{graph_id}/{entity_uuid}',
                                    path: {
                                        'graph_id': graphId,
                                        'entity_uuid': entityUuid,
                                    },
                                    errors: {
                                        404: `Referenced resource was not found.`,
                                        500: `Unhandled backend error.`,
                                    },
                                });
                            }
                            /**
                             * 获取模拟环境状态
                             * 获取模拟环境状态
                             *
                             * 检查模拟环境是否存活（可以接收Interview命令）
                             *
                             * 请求（JSON）：
                             * {
                                 * "simulation_id": "sim_xxxx"  // 必填，模拟ID
                                 * }
                                 *
                                 * 返回：
                                 * {
                                     * "success": true,
                                     * "data": {
                                         * "simulation_id": "sim_xxxx",
                                         * "env_alive": true,
                                         * "twitter_available": true,
                                         * "reddit_available": true,
                                         * "message": "环境正在运行，可以接收Interview命令"
                                         * }
                                         * }
                                         * @param requestBody
                                         * @returns SuccessEnvelope Successful response.
                                         * @throws ApiError
                                         */
                                        public static simulationGetEnvStatusPost(
                                            requestBody: Record<string, any>,
                                        ): CancelablePromise<SuccessEnvelope> {
                                            return __request(OpenAPI, {
                                                method: 'POST',
                                                url: '/api/simulation/env-status',
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
                                         * 直接从图谱生成OASIS Agent Profile（不创建模拟）
                                         * 直接从图谱生成OASIS Agent Profile（不创建模拟）
                                         *
                                         * 请求（JSON）：
                                         * {
                                             * "graph_id": "mirofish_xxxx",     // 必填
                                             * "entity_types": ["Student"],      // 可选
                                             * "use_llm": true,                  // 可选
                                             * "platform": "reddit"              // 可选
                                             * }
                                             * @param requestBody
                                             * @returns SuccessEnvelope Successful response.
                                             * @throws ApiError
                                             */
                                            public static simulationGenerateProfilesPost(
                                                requestBody: Record<string, any>,
                                            ): CancelablePromise<SuccessEnvelope> {
                                                return __request(OpenAPI, {
                                                    method: 'POST',
                                                    url: '/api/simulation/generate-profiles',
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
                                             * 获取历史模拟列表（带项目详情）
                                             * 获取历史模拟列表（带项目详情）
                                             *
                                             * 用于首页历史项目展示，返回包含项目名称、描述等丰富信息的模拟列表
                                             *
                                             * Query参数：
                                             * limit: 返回数量限制（默认20）
                                             *
                                             * 返回：
                                             * {
                                                 * "success": true,
                                                 * "data": [
                                                     * {
                                                         * "simulation_id": "sim_xxxx",
                                                         * "project_id": "proj_xxxx",
                                                         * "project_name": "武大舆情分析",
                                                         * "simulation_requirement": "如果武汉大学发布...",
                                                         * "status": "completed",
                                                         * "entities_count": 68,
                                                         * "profiles_count": 68,
                                                         * "entity_types": ["Student", "Professor", ...],
                                                         * "created_at": "2024-12-10",
                                                         * "updated_at": "2024-12-10",
                                                         * "total_rounds": 120,
                                                         * "current_round": 120,
                                                         * "report_id": "report_xxxx",
                                                         * "version": "v1.0.2"
                                                         * },
                                                         * ...
                                                         * ],
                                                         * "count": 7
                                                         * }
                                                         * @returns SuccessEnvelope Successful response.
                                                         * @throws ApiError
                                                         */
                                                        public static simulationGetSimulationHistoryGet(): CancelablePromise<SuccessEnvelope> {
                                                            return __request(OpenAPI, {
                                                                method: 'GET',
                                                                url: '/api/simulation/history',
                                                                errors: {
                                                                    404: `Referenced resource was not found.`,
                                                                    500: `Unhandled backend error.`,
                                                                },
                                                            });
                                                        }
                                                        /**
                                                         * 采访单个Agent
                                                         * 采访单个Agent
                                                         *
                                                         * 注意：此功能需要模拟环境处于运行状态（完成模拟循环后进入等待命令模式）
                                                         *
                                                         * 请求（JSON）：
                                                         * {
                                                             * "simulation_id": "sim_xxxx",       // 必填，模拟ID
                                                             * "agent_id": 0,                     // 必填，Agent ID
                                                             * "prompt": "你对这件事有什么看法？",  // 必填，采访问题
                                                             * "platform": "twitter",             // 可选，指定平台（twitter/reddit）
                                                             * // 不指定时：双平台模拟同时采访两个平台
                                                             * "timeout": 60                      // 可选，超时时间（秒），默认60
                                                             * }
                                                             *
                                                             * 返回（不指定platform，双平台模式）：
                                                             * {
                                                                 * "success": true,
                                                                 * "data": {
                                                                     * "agent_id": 0,
                                                                     * "prompt": "你对这件事有什么看法？",
                                                                     * "result": {
                                                                         * "agent_id": 0,
                                                                         * "prompt": "...",
                                                                         * "platforms": {
                                                                             * "twitter": {"agent_id": 0, "response": "...", "platform": "twitter"},
                                                                             * "reddit": {"agent_id": 0, "response": "...", "platform": "reddit"}
                                                                             * }
                                                                             * },
                                                                             * "timestamp": "2025-12-08T10:00:01"
                                                                             * }
                                                                             * }
                                                                             *
                                                                             * 返回（指定platform）：
                                                                             * {
                                                                                 * "success": true,
                                                                                 * "data": {
                                                                                     * "agent_id": 0,
                                                                                     * "prompt": "你对这件事有什么看法？",
                                                                                     * "result": {
                                                                                         * "agent_id": 0,
                                                                                         * "response": "我认为...",
                                                                                         * "platform": "twitter",
                                                                                         * "timestamp": "2025-12-08T10:00:00"
                                                                                         * },
                                                                                         * "timestamp": "2025-12-08T10:00:01"
                                                                                         * }
                                                                                         * }
                                                                                         * @param requestBody
                                                                                         * @returns SuccessEnvelope Successful response.
                                                                                         * @throws ApiError
                                                                                         */
                                                                                        public static simulationInterviewAgentPost(
                                                                                            requestBody: Record<string, any>,
                                                                                        ): CancelablePromise<SuccessEnvelope> {
                                                                                            return __request(OpenAPI, {
                                                                                                method: 'POST',
                                                                                                url: '/api/simulation/interview',
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
                                                                                         * 全局采访 - 使用相同问题采访所有Agent
                                                                                         * 全局采访 - 使用相同问题采访所有Agent
                                                                                         *
                                                                                         * 注意：此功能需要模拟环境处于运行状态
                                                                                         *
                                                                                         * 请求（JSON）：
                                                                                         * {
                                                                                             * "simulation_id": "sim_xxxx",            // 必填，模拟ID
                                                                                             * "prompt": "你对这件事整体有什么看法？",  // 必填，采访问题（所有Agent使用相同问题）
                                                                                             * "platform": "reddit",                   // 可选，指定平台（twitter/reddit）
                                                                                             * // 不指定时：双平台模拟每个Agent同时采访两个平台
                                                                                             * "timeout": 180                          // 可选，超时时间（秒），默认180
                                                                                             * }
                                                                                             *
                                                                                             * 返回：
                                                                                             * {
                                                                                                 * "success": true,
                                                                                                 * "data": {
                                                                                                     * "interviews_count": 50,
                                                                                                     * "result": {
                                                                                                         * "interviews_count": 100,
                                                                                                         * "results": {
                                                                                                             * "twitter_0": {"agent_id": 0, "response": "...", "platform": "twitter"},
                                                                                                             * "reddit_0": {"agent_id": 0, "response": "...", "platform": "reddit"},
                                                                                                             * ...
                                                                                                             * }
                                                                                                             * },
                                                                                                             * "timestamp": "2025-12-08T10:00:01"
                                                                                                             * }
                                                                                                             * }
                                                                                                             * @param requestBody
                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                             * @throws ApiError
                                                                                                             */
                                                                                                            public static simulationInterviewAllAgentsPost(
                                                                                                                requestBody: Record<string, any>,
                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                return __request(OpenAPI, {
                                                                                                                    method: 'POST',
                                                                                                                    url: '/api/simulation/interview/all',
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
                                                                                                             * 批量采访多个Agent
                                                                                                             * 批量采访多个Agent
                                                                                                             *
                                                                                                             * 注意：此功能需要模拟环境处于运行状态
                                                                                                             *
                                                                                                             * 请求（JSON）：
                                                                                                             * {
                                                                                                                 * "simulation_id": "sim_xxxx",       // 必填，模拟ID
                                                                                                                 * "interviews": [                    // 必填，采访列表
                                                                                                                 * {
                                                                                                                     * "agent_id": 0,
                                                                                                                     * "prompt": "你对A有什么看法？",
                                                                                                                     * "platform": "twitter"      // 可选，指定该Agent的采访平台
                                                                                                                     * },
                                                                                                                     * {
                                                                                                                         * "agent_id": 1,
                                                                                                                         * "prompt": "你对B有什么看法？"  // 不指定platform则使用默认值
                                                                                                                         * }
                                                                                                                         * ],
                                                                                                                         * "platform": "reddit",              // 可选，默认平台（被每项的platform覆盖）
                                                                                                                         * // 不指定时：双平台模拟每个Agent同时采访两个平台
                                                                                                                         * "timeout": 120                     // 可选，超时时间（秒），默认120
                                                                                                                         * }
                                                                                                                         *
                                                                                                                         * 返回：
                                                                                                                         * {
                                                                                                                             * "success": true,
                                                                                                                             * "data": {
                                                                                                                                 * "interviews_count": 2,
                                                                                                                                 * "result": {
                                                                                                                                     * "interviews_count": 4,
                                                                                                                                     * "results": {
                                                                                                                                         * "twitter_0": {"agent_id": 0, "response": "...", "platform": "twitter"},
                                                                                                                                         * "reddit_0": {"agent_id": 0, "response": "...", "platform": "reddit"},
                                                                                                                                         * "twitter_1": {"agent_id": 1, "response": "...", "platform": "twitter"},
                                                                                                                                         * "reddit_1": {"agent_id": 1, "response": "...", "platform": "reddit"}
                                                                                                                                         * }
                                                                                                                                         * },
                                                                                                                                         * "timestamp": "2025-12-08T10:00:01"
                                                                                                                                         * }
                                                                                                                                         * }
                                                                                                                                         * @param requestBody
                                                                                                                                         * @returns SuccessEnvelope Successful response.
                                                                                                                                         * @throws ApiError
                                                                                                                                         */
                                                                                                                                        public static simulationInterviewAgentsBatchPost(
                                                                                                                                            requestBody: Record<string, any>,
                                                                                                                                        ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                            return __request(OpenAPI, {
                                                                                                                                                method: 'POST',
                                                                                                                                                url: '/api/simulation/interview/batch',
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
                                                                                                                                         * 获取Interview历史记录
                                                                                                                                         * 获取Interview历史记录
                                                                                                                                         *
                                                                                                                                         * 从模拟数据库中读取所有Interview记录
                                                                                                                                         *
                                                                                                                                         * 请求（JSON）：
                                                                                                                                         * {
                                                                                                                                             * "simulation_id": "sim_xxxx",  // 必填，模拟ID
                                                                                                                                             * "platform": "reddit",          // 可选，平台类型（reddit/twitter）
                                                                                                                                             * // 不指定则返回两个平台的所有历史
                                                                                                                                             * "agent_id": 0,                 // 可选，只获取该Agent的采访历史
                                                                                                                                             * "limit": 100                   // 可选，返回数量，默认100
                                                                                                                                             * }
                                                                                                                                             *
                                                                                                                                             * 返回：
                                                                                                                                             * {
                                                                                                                                                 * "success": true,
                                                                                                                                                 * "data": {
                                                                                                                                                     * "count": 10,
                                                                                                                                                     * "history": [
                                                                                                                                                         * {
                                                                                                                                                             * "agent_id": 0,
                                                                                                                                                             * "response": "我认为...",
                                                                                                                                                             * "prompt": "你对这件事有什么看法？",
                                                                                                                                                             * "timestamp": "2025-12-08T10:00:00",
                                                                                                                                                             * "platform": "reddit"
                                                                                                                                                             * },
                                                                                                                                                             * ...
                                                                                                                                                             * ]
                                                                                                                                                             * }
                                                                                                                                                             * }
                                                                                                                                                             * @param requestBody
                                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                                             * @throws ApiError
                                                                                                                                                             */
                                                                                                                                                            public static simulationGetInterviewHistoryPost(
                                                                                                                                                                requestBody: Record<string, any>,
                                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                    method: 'POST',
                                                                                                                                                                    url: '/api/simulation/interview/history',
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
                                                                                                                                                             * List simulations
                                                                                                                                                             * 列出所有模拟
                                                                                                                                                             *
                                                                                                                                                             * Query参数：
                                                                                                                                                             * project_id: 按项目ID过滤（可选）
                                                                                                                                                             * @param projectId Optional project id to filter simulations.
                                                                                                                                                             * @returns SimulationListResponse Successful response.
                                                                                                                                                             * @throws ApiError
                                                                                                                                                             */
                                                                                                                                                            public static simulationListSimulationsGet(
                                                                                                                                                                projectId?: string,
                                                                                                                                                            ): CancelablePromise<SimulationListResponse> {
                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                    method: 'GET',
                                                                                                                                                                    url: '/api/simulation/list',
                                                                                                                                                                    query: {
                                                                                                                                                                        'project_id': projectId,
                                                                                                                                                                    },
                                                                                                                                                                    errors: {
                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                    },
                                                                                                                                                                });
                                                                                                                                                            }
                                                                                                                                                            /**
                                                                                                                                                             * 准备模拟环境（异步任务，LLM智能生成所有参数）
                                                                                                                                                             * 准备模拟环境（异步任务，LLM智能生成所有参数）
                                                                                                                                                             *
                                                                                                                                                             * 这是一个耗时操作，接口会立即返回task_id，
                                                                                                                                                             * 使用 GET /api/simulation/prepare/status 查询进度
                                                                                                                                                             *
                                                                                                                                                             * 特性：
                                                                                                                                                             * - 自动检测已完成的准备工作，避免重复生成
                                                                                                                                                             * - 如果已准备完成，直接返回已有结果
                                                                                                                                                             * - 支持强制重新生成（force_regenerate=true）
                                                                                                                                                             *
                                                                                                                                                             * 步骤：
                                                                                                                                                             * 1. 检查是否已有完成的准备工作
                                                                                                                                                             * 2. 从Zep图谱读取并过滤实体
                                                                                                                                                             * 3. 为每个实体生成OASIS Agent Profile（带重试机制）
                                                                                                                                                             * 4. LLM智能生成模拟配置（带重试机制）
                                                                                                                                                             * 5. 保存配置文件和预设脚本
                                                                                                                                                             *
                                                                                                                                                             * 请求（JSON）：
                                                                                                                                                             * {
                                                                                                                                                                 * "simulation_id": "sim_xxxx",                   // 必填，模拟ID
                                                                                                                                                                 * "entity_types": ["Student", "PublicFigure"],  // 可选，指定实体类型
                                                                                                                                                                 * "use_llm_for_profiles": true,                 // 可选，是否用LLM生成人设
                                                                                                                                                                 * "parallel_profile_count": 5,                  // 可选，并行生成人设数量，默认5
                                                                                                                                                                 * "force_regenerate": false                     // 可选，强制重新生成，默认false
                                                                                                                                                                 * }
                                                                                                                                                                 *
                                                                                                                                                                 * 返回：
                                                                                                                                                                 * {
                                                                                                                                                                     * "success": true,
                                                                                                                                                                     * "data": {
                                                                                                                                                                         * "simulation_id": "sim_xxxx",
                                                                                                                                                                         * "task_id": "task_xxxx",           // 新任务时返回
                                                                                                                                                                         * "status": "preparing|ready",
                                                                                                                                                                         * "message": "准备任务已启动|已有完成的准备工作",
                                                                                                                                                                         * "already_prepared": true|false    // 是否已准备完成
                                                                                                                                                                         * }
                                                                                                                                                                         * }
                                                                                                                                                                         * @param requestBody
                                                                                                                                                                         * @returns SuccessEnvelope Successful response.
                                                                                                                                                                         * @throws ApiError
                                                                                                                                                                         */
                                                                                                                                                                        public static simulationPrepareSimulationPost(
                                                                                                                                                                            requestBody: Record<string, any>,
                                                                                                                                                                        ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                            return __request(OpenAPI, {
                                                                                                                                                                                method: 'POST',
                                                                                                                                                                                url: '/api/simulation/prepare',
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
                                                                                                                                                                         * Get simulation prepare task status
                                                                                                                                                                         * 查询准备任务进度
                                                                                                                                                                         *
                                                                                                                                                                         * 支持两种查询方式：
                                                                                                                                                                         * 1. 通过task_id查询正在进行的任务进度
                                                                                                                                                                         * 2. 通过simulation_id检查是否已有完成的准备工作
                                                                                                                                                                         *
                                                                                                                                                                         * 请求（JSON）：
                                                                                                                                                                         * {
                                                                                                                                                                             * "task_id": "task_xxxx",          // 可选，prepare返回的task_id
                                                                                                                                                                             * "simulation_id": "sim_xxxx"      // 可选，模拟ID（用于检查已完成的准备）
                                                                                                                                                                             * }
                                                                                                                                                                             *
                                                                                                                                                                             * 返回：
                                                                                                                                                                             * {
                                                                                                                                                                                 * "success": true,
                                                                                                                                                                                 * "data": {
                                                                                                                                                                                     * "task_id": "task_xxxx",
                                                                                                                                                                                     * "status": "processing|completed|ready",
                                                                                                                                                                                     * "progress": 45,
                                                                                                                                                                                     * "message": "...",
                                                                                                                                                                                     * "already_prepared": true|false,  // 是否已有完成的准备
                                                                                                                                                                                     * "prepare_info": {...}            // 已准备完成时的详细信息
                                                                                                                                                                                     * }
                                                                                                                                                                                     * }
                                                                                                                                                                                     * @param requestBody
                                                                                                                                                                                     * @returns SimulationPrepareStatusResponse Successful response.
                                                                                                                                                                                     * @throws ApiError
                                                                                                                                                                                     */
                                                                                                                                                                                    public static simulationGetPrepareStatusPost(
                                                                                                                                                                                        requestBody: SimulationPrepareStatusRequest,
                                                                                                                                                                                    ): CancelablePromise<SimulationPrepareStatusResponse> {
                                                                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                                                                            method: 'POST',
                                                                                                                                                                                            url: '/api/simulation/prepare/status',
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
                                                                                                                                                                                     * 下载模拟运行脚本文件（通用脚本，位于 scripts/）
                                                                                                                                                                                     * 下载模拟运行脚本文件（通用脚本，位于 scripts/）
                                                                                                                                                                                     *
                                                                                                                                                                                     * script_name可选值：
                                                                                                                                                                                     * - run_twitter_simulation.py
                                                                                                                                                                                     * - run_reddit_simulation.py
                                                                                                                                                                                     * - run_parallel_simulation.py
                                                                                                                                                                                     * - action_logger.py
                                                                                                                                                                                     * @param scriptName
                                                                                                                                                                                     * @returns binary Successful response.
                                                                                                                                                                                     * @throws ApiError
                                                                                                                                                                                     */
                                                                                                                                                                                    public static simulationDownloadSimulationScriptGet(
                                                                                                                                                                                        scriptName: string,
                                                                                                                                                                                    ): CancelablePromise<Blob> {
                                                                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                                                                            method: 'GET',
                                                                                                                                                                                            url: '/api/simulation/script/{script_name}/download',
                                                                                                                                                                                            path: {
                                                                                                                                                                                                'script_name': scriptName,
                                                                                                                                                                                            },
                                                                                                                                                                                            errors: {
                                                                                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                                                                                            },
                                                                                                                                                                                        });
                                                                                                                                                                                    }
                                                                                                                                                                                    /**
                                                                                                                                                                                     * 开始运行模拟
                                                                                                                                                                                     * 开始运行模拟
                                                                                                                                                                                     *
                                                                                                                                                                                     * 请求（JSON）：
                                                                                                                                                                                     * {
                                                                                                                                                                                         * "simulation_id": "sim_xxxx",          // 必填，模拟ID
                                                                                                                                                                                         * "platform": "parallel",                // 可选: twitter / reddit / parallel (默认)
                                                                                                                                                                                         * "max_rounds": 100,                     // 可选: 最大模拟轮数，用于截断过长的模拟
                                                                                                                                                                                         * "enable_graph_memory_update": false,   // 可选: 是否将Agent活动动态更新到Zep图谱记忆
                                                                                                                                                                                         * "force": false                         // 可选: 强制重新开始（会停止运行中的模拟并清理日志）
                                                                                                                                                                                         * }
                                                                                                                                                                                         *
                                                                                                                                                                                         * 关于 force 参数：
                                                                                                                                                                                         * - 启用后，如果模拟正在运行或已完成，会先停止并清理运行日志
                                                                                                                                                                                         * - 清理的内容包括：run_state.json, actions.jsonl, simulation.log 等
                                                                                                                                                                                         * - 不会清理配置文件（simulation_config.json）和 profile 文件
                                                                                                                                                                                         * - 适用于需要重新运行模拟的场景
                                                                                                                                                                                         *
                                                                                                                                                                                         * 关于 enable_graph_memory_update：
                                                                                                                                                                                         * - 启用后，模拟中所有Agent的活动（发帖、评论、点赞等）都会实时更新到Zep图谱
                                                                                                                                                                                         * - 这可以让图谱"记住"模拟过程，用于后续分析或AI对话
                                                                                                                                                                                         * - 需要模拟关联的项目有有效的 graph_id
                                                                                                                                                                                         * - 采用批量更新机制，减少API调用次数
                                                                                                                                                                                         *
                                                                                                                                                                                         * 返回：
                                                                                                                                                                                         * {
                                                                                                                                                                                             * "success": true,
                                                                                                                                                                                             * "data": {
                                                                                                                                                                                                 * "simulation_id": "sim_xxxx",
                                                                                                                                                                                                 * "runner_status": "running",
                                                                                                                                                                                                 * "process_pid": 12345,
                                                                                                                                                                                                 * "twitter_running": true,
                                                                                                                                                                                                 * "reddit_running": true,
                                                                                                                                                                                                 * "started_at": "2025-12-01T10:00:00",
                                                                                                                                                                                                 * "graph_memory_update_enabled": true,  // 是否启用了图谱记忆更新
                                                                                                                                                                                                 * "force_restarted": true               // 是否是强制重新开始
                                                                                                                                                                                                 * }
                                                                                                                                                                                                 * }
                                                                                                                                                                                                 * @param requestBody
                                                                                                                                                                                                 * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                 * @throws ApiError
                                                                                                                                                                                                 */
                                                                                                                                                                                                public static simulationStartSimulationPost(
                                                                                                                                                                                                    requestBody: Record<string, any>,
                                                                                                                                                                                                ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                    return __request(OpenAPI, {
                                                                                                                                                                                                        method: 'POST',
                                                                                                                                                                                                        url: '/api/simulation/start',
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
                                                                                                                                                                                                 * 停止模拟
                                                                                                                                                                                                 * 停止模拟
                                                                                                                                                                                                 *
                                                                                                                                                                                                 * 请求（JSON）：
                                                                                                                                                                                                 * {
                                                                                                                                                                                                     * "simulation_id": "sim_xxxx"  // 必填，模拟ID
                                                                                                                                                                                                     * }
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * 返回：
                                                                                                                                                                                                     * {
                                                                                                                                                                                                         * "success": true,
                                                                                                                                                                                                         * "data": {
                                                                                                                                                                                                             * "simulation_id": "sim_xxxx",
                                                                                                                                                                                                             * "runner_status": "stopped",
                                                                                                                                                                                                             * "completed_at": "2025-12-01T12:00:00"
                                                                                                                                                                                                             * }
                                                                                                                                                                                                             * }
                                                                                                                                                                                                             * @param requestBody
                                                                                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                             * @throws ApiError
                                                                                                                                                                                                             */
                                                                                                                                                                                                            public static simulationStopSimulationPost(
                                                                                                                                                                                                                requestBody: Record<string, any>,
                                                                                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                                                                    method: 'POST',
                                                                                                                                                                                                                    url: '/api/simulation/stop',
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
                                                                                                                                                                                                             * Get simulation state
                                                                                                                                                                                                             * 获取模拟状态
                                                                                                                                                                                                             * @param simulationId
                                                                                                                                                                                                             * @returns SimulationResponse Successful response.
                                                                                                                                                                                                             * @throws ApiError
                                                                                                                                                                                                             */
                                                                                                                                                                                                            public static simulationGetSimulationGet(
                                                                                                                                                                                                                simulationId: string,
                                                                                                                                                                                                            ): CancelablePromise<SimulationResponse> {
                                                                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                                                                    method: 'GET',
                                                                                                                                                                                                                    url: '/api/simulation/{simulation_id}',
                                                                                                                                                                                                                    path: {
                                                                                                                                                                                                                        'simulation_id': simulationId,
                                                                                                                                                                                                                    },
                                                                                                                                                                                                                    errors: {
                                                                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                                                                    },
                                                                                                                                                                                                                });
                                                                                                                                                                                                            }
                                                                                                                                                                                                            /**
                                                                                                                                                                                                             * 获取模拟中的Agent动作历史
                                                                                                                                                                                                             * 获取模拟中的Agent动作历史
                                                                                                                                                                                                             *
                                                                                                                                                                                                             * Query参数：
                                                                                                                                                                                                             * limit: 返回数量（默认100）
                                                                                                                                                                                                             * offset: 偏移量（默认0）
                                                                                                                                                                                                             * platform: 过滤平台（twitter/reddit）
                                                                                                                                                                                                             * agent_id: 过滤Agent ID
                                                                                                                                                                                                             * round_num: 过滤轮次
                                                                                                                                                                                                             *
                                                                                                                                                                                                             * 返回：
                                                                                                                                                                                                             * {
                                                                                                                                                                                                                 * "success": true,
                                                                                                                                                                                                                 * "data": {
                                                                                                                                                                                                                     * "count": 100,
                                                                                                                                                                                                                     * "actions": [...]
                                                                                                                                                                                                                     * }
                                                                                                                                                                                                                     * }
                                                                                                                                                                                                                     * @param simulationId
                                                                                                                                                                                                                     * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                     * @throws ApiError
                                                                                                                                                                                                                     */
                                                                                                                                                                                                                    public static simulationGetSimulationActionsGet(
                                                                                                                                                                                                                        simulationId: string,
                                                                                                                                                                                                                    ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                                                                                                            method: 'GET',
                                                                                                                                                                                                                            url: '/api/simulation/{simulation_id}/actions',
                                                                                                                                                                                                                            path: {
                                                                                                                                                                                                                                'simulation_id': simulationId,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            errors: {
                                                                                                                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    /**
                                                                                                                                                                                                                     * 获取每个Agent的统计信息
                                                                                                                                                                                                                     * 获取每个Agent的统计信息
                                                                                                                                                                                                                     *
                                                                                                                                                                                                                     * 用于前端展示Agent活跃度排行、动作分布等
                                                                                                                                                                                                                     * @param simulationId
                                                                                                                                                                                                                     * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                     * @throws ApiError
                                                                                                                                                                                                                     */
                                                                                                                                                                                                                    public static simulationGetAgentStatsGet(
                                                                                                                                                                                                                        simulationId: string,
                                                                                                                                                                                                                    ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                                                                                                            method: 'GET',
                                                                                                                                                                                                                            url: '/api/simulation/{simulation_id}/agent-stats',
                                                                                                                                                                                                                            path: {
                                                                                                                                                                                                                                'simulation_id': simulationId,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            errors: {
                                                                                                                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    /**
                                                                                                                                                                                                                     * 获取模拟中的评论（仅Reddit）
                                                                                                                                                                                                                     * 获取模拟中的评论（仅Reddit）
                                                                                                                                                                                                                     *
                                                                                                                                                                                                                     * Query参数：
                                                                                                                                                                                                                     * post_id: 过滤帖子ID（可选）
                                                                                                                                                                                                                     * limit: 返回数量
                                                                                                                                                                                                                     * offset: 偏移量
                                                                                                                                                                                                                     * @param simulationId
                                                                                                                                                                                                                     * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                     * @throws ApiError
                                                                                                                                                                                                                     */
                                                                                                                                                                                                                    public static simulationGetSimulationCommentsGet(
                                                                                                                                                                                                                        simulationId: string,
                                                                                                                                                                                                                    ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                                                                                                            method: 'GET',
                                                                                                                                                                                                                            url: '/api/simulation/{simulation_id}/comments',
                                                                                                                                                                                                                            path: {
                                                                                                                                                                                                                                'simulation_id': simulationId,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            errors: {
                                                                                                                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    /**
                                                                                                                                                                                                                     * 获取模拟配置（LLM智能生成的完整配置）
                                                                                                                                                                                                                     * 获取模拟配置（LLM智能生成的完整配置）
                                                                                                                                                                                                                     *
                                                                                                                                                                                                                     * 返回包含：
                                                                                                                                                                                                                     * - time_config: 时间配置（模拟时长、轮次、高峰/低谷时段）
                                                                                                                                                                                                                     * - agent_configs: 每个Agent的活动配置（活跃度、发言频率、立场等）
                                                                                                                                                                                                                     * - event_config: 事件配置（初始帖子、热点话题）
                                                                                                                                                                                                                     * - platform_configs: 平台配置
                                                                                                                                                                                                                     * - generation_reasoning: LLM的配置推理说明
                                                                                                                                                                                                                     * @param simulationId
                                                                                                                                                                                                                     * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                     * @throws ApiError
                                                                                                                                                                                                                     */
                                                                                                                                                                                                                    public static simulationGetSimulationConfigGet(
                                                                                                                                                                                                                        simulationId: string,
                                                                                                                                                                                                                    ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                                                                                                            method: 'GET',
                                                                                                                                                                                                                            url: '/api/simulation/{simulation_id}/config',
                                                                                                                                                                                                                            path: {
                                                                                                                                                                                                                                'simulation_id': simulationId,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            errors: {
                                                                                                                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    /**
                                                                                                                                                                                                                     * 下载模拟配置文件
                                                                                                                                                                                                                     * 下载模拟配置文件
                                                                                                                                                                                                                     * @param simulationId
                                                                                                                                                                                                                     * @returns binary Successful response.
                                                                                                                                                                                                                     * @throws ApiError
                                                                                                                                                                                                                     */
                                                                                                                                                                                                                    public static simulationDownloadSimulationConfigGet(
                                                                                                                                                                                                                        simulationId: string,
                                                                                                                                                                                                                    ): CancelablePromise<Blob> {
                                                                                                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                                                                                                            method: 'GET',
                                                                                                                                                                                                                            url: '/api/simulation/{simulation_id}/config/download',
                                                                                                                                                                                                                            path: {
                                                                                                                                                                                                                                'simulation_id': simulationId,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            errors: {
                                                                                                                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    /**
                                                                                                                                                                                                                     * 实时获取模拟配置（用于在生成过程中实时查看进度）
                                                                                                                                                                                                                     * 实时获取模拟配置（用于在生成过程中实时查看进度）
                                                                                                                                                                                                                     *
                                                                                                                                                                                                                     * 与 /config 接口的区别：
                                                                                                                                                                                                                     * - 直接读取文件，不经过 SimulationManager
                                                                                                                                                                                                                     * - 适用于生成过程中的实时查看
                                                                                                                                                                                                                     * - 返回额外的元数据（如文件修改时间、是否正在生成等）
                                                                                                                                                                                                                     * - 即使配置还没生成完也能返回部分信息
                                                                                                                                                                                                                     *
                                                                                                                                                                                                                     * 返回：
                                                                                                                                                                                                                     * {
                                                                                                                                                                                                                         * "success": true,
                                                                                                                                                                                                                         * "data": {
                                                                                                                                                                                                                             * "simulation_id": "sim_xxxx",
                                                                                                                                                                                                                             * "file_exists": true,
                                                                                                                                                                                                                             * "file_modified_at": "2025-12-04T18:20:00",
                                                                                                                                                                                                                             * "is_generating": true,  // 是否正在生成
                                                                                                                                                                                                                             * "generation_stage": "generating_config",  // 当前生成阶段
                                                                                                                                                                                                                             * "config": {...}  // 配置内容（如果存在）
                                                                                                                                                                                                                             * }
                                                                                                                                                                                                                             * }
                                                                                                                                                                                                                             * @param simulationId
                                                                                                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                             * @throws ApiError
                                                                                                                                                                                                                             */
                                                                                                                                                                                                                            public static simulationGetSimulationConfigRealtimeGet(
                                                                                                                                                                                                                                simulationId: string,
                                                                                                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                                                                                    method: 'GET',
                                                                                                                                                                                                                                    url: '/api/simulation/{simulation_id}/config/realtime',
                                                                                                                                                                                                                                    path: {
                                                                                                                                                                                                                                        'simulation_id': simulationId,
                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                    errors: {
                                                                                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                });
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            /**
                                                                                                                                                                                                                             * 获取模拟中的帖子
                                                                                                                                                                                                                             * 获取模拟中的帖子
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * Query参数：
                                                                                                                                                                                                                             * platform: 平台类型（twitter/reddit）
                                                                                                                                                                                                                             * limit: 返回数量（默认50）
                                                                                                                                                                                                                             * offset: 偏移量
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * 返回帖子列表（从SQLite数据库读取）
                                                                                                                                                                                                                             * @param simulationId
                                                                                                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                             * @throws ApiError
                                                                                                                                                                                                                             */
                                                                                                                                                                                                                            public static simulationGetSimulationPostsGet(
                                                                                                                                                                                                                                simulationId: string,
                                                                                                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                                                                                    method: 'GET',
                                                                                                                                                                                                                                    url: '/api/simulation/{simulation_id}/posts',
                                                                                                                                                                                                                                    path: {
                                                                                                                                                                                                                                        'simulation_id': simulationId,
                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                    errors: {
                                                                                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                });
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            /**
                                                                                                                                                                                                                             * 获取模拟的Agent Profile
                                                                                                                                                                                                                             * 获取模拟的Agent Profile
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * Query参数：
                                                                                                                                                                                                                             * platform: 平台类型（reddit/twitter，默认reddit）
                                                                                                                                                                                                                             * @param simulationId
                                                                                                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                             * @throws ApiError
                                                                                                                                                                                                                             */
                                                                                                                                                                                                                            public static simulationGetSimulationProfilesGet(
                                                                                                                                                                                                                                simulationId: string,
                                                                                                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                                                                                    method: 'GET',
                                                                                                                                                                                                                                    url: '/api/simulation/{simulation_id}/profiles',
                                                                                                                                                                                                                                    path: {
                                                                                                                                                                                                                                        'simulation_id': simulationId,
                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                    errors: {
                                                                                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                });
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            /**
                                                                                                                                                                                                                             * 实时获取模拟的Agent Profile（用于在生成过程中实时查看进度）
                                                                                                                                                                                                                             * 实时获取模拟的Agent Profile（用于在生成过程中实时查看进度）
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * 与 /profiles 接口的区别：
                                                                                                                                                                                                                             * - 直接读取文件，不经过 SimulationManager
                                                                                                                                                                                                                             * - 适用于生成过程中的实时查看
                                                                                                                                                                                                                             * - 返回额外的元数据（如文件修改时间、是否正在生成等）
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * Query参数：
                                                                                                                                                                                                                             * platform: 平台类型（reddit/twitter，默认reddit）
                                                                                                                                                                                                                             *
                                                                                                                                                                                                                             * 返回：
                                                                                                                                                                                                                             * {
                                                                                                                                                                                                                                 * "success": true,
                                                                                                                                                                                                                                 * "data": {
                                                                                                                                                                                                                                     * "simulation_id": "sim_xxxx",
                                                                                                                                                                                                                                     * "platform": "reddit",
                                                                                                                                                                                                                                     * "count": 15,
                                                                                                                                                                                                                                     * "total_expected": 93,  // 预期总数（如果有）
                                                                                                                                                                                                                                     * "is_generating": true,  // 是否正在生成
                                                                                                                                                                                                                                     * "file_exists": true,
                                                                                                                                                                                                                                     * "file_modified_at": "2025-12-04T18:20:00",
                                                                                                                                                                                                                                     * "profiles": [...]
                                                                                                                                                                                                                                     * }
                                                                                                                                                                                                                                     * }
                                                                                                                                                                                                                                     * @param simulationId
                                                                                                                                                                                                                                     * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                                     * @throws ApiError
                                                                                                                                                                                                                                     */
                                                                                                                                                                                                                                    public static simulationGetSimulationProfilesRealtimeGet(
                                                                                                                                                                                                                                        simulationId: string,
                                                                                                                                                                                                                                    ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                                                                                                                            method: 'GET',
                                                                                                                                                                                                                                            url: '/api/simulation/{simulation_id}/profiles/realtime',
                                                                                                                                                                                                                                            path: {
                                                                                                                                                                                                                                                'simulation_id': simulationId,
                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                            errors: {
                                                                                                                                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    /**
                                                                                                                                                                                                                                     * Get simulation run status
                                                                                                                                                                                                                                     * 获取模拟运行实时状态（用于前端轮询）
                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                     * 返回：
                                                                                                                                                                                                                                     * {
                                                                                                                                                                                                                                         * "success": true,
                                                                                                                                                                                                                                         * "data": {
                                                                                                                                                                                                                                             * "simulation_id": "sim_xxxx",
                                                                                                                                                                                                                                             * "runner_status": "running",
                                                                                                                                                                                                                                             * "current_round": 5,
                                                                                                                                                                                                                                             * "total_rounds": 144,
                                                                                                                                                                                                                                             * "progress_percent": 3.5,
                                                                                                                                                                                                                                             * "simulated_hours": 2,
                                                                                                                                                                                                                                             * "total_simulation_hours": 72,
                                                                                                                                                                                                                                             * "twitter_running": true,
                                                                                                                                                                                                                                             * "reddit_running": true,
                                                                                                                                                                                                                                             * "twitter_actions_count": 150,
                                                                                                                                                                                                                                             * "reddit_actions_count": 200,
                                                                                                                                                                                                                                             * "total_actions_count": 350,
                                                                                                                                                                                                                                             * "started_at": "2025-12-01T10:00:00",
                                                                                                                                                                                                                                             * "updated_at": "2025-12-01T10:30:00"
                                                                                                                                                                                                                                             * }
                                                                                                                                                                                                                                             * }
                                                                                                                                                                                                                                             * @param simulationId
                                                                                                                                                                                                                                             * @returns SimulationRunStatusResponse Successful response.
                                                                                                                                                                                                                                             * @throws ApiError
                                                                                                                                                                                                                                             */
                                                                                                                                                                                                                                            public static simulationGetRunStatusGet(
                                                                                                                                                                                                                                                simulationId: string,
                                                                                                                                                                                                                                            ): CancelablePromise<SimulationRunStatusResponse> {
                                                                                                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                                                                                                    method: 'GET',
                                                                                                                                                                                                                                                    url: '/api/simulation/{simulation_id}/run-status',
                                                                                                                                                                                                                                                    path: {
                                                                                                                                                                                                                                                        'simulation_id': simulationId,
                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                    errors: {
                                                                                                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            /**
                                                                                                                                                                                                                                             * 获取模拟运行详细状态（包含所有动作）
                                                                                                                                                                                                                                             * 获取模拟运行详细状态（包含所有动作）
                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                             * 用于前端展示实时动态
                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                             * Query参数：
                                                                                                                                                                                                                                             * platform: 过滤平台（twitter/reddit，可选）
                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                             * 返回：
                                                                                                                                                                                                                                             * {
                                                                                                                                                                                                                                                 * "success": true,
                                                                                                                                                                                                                                                 * "data": {
                                                                                                                                                                                                                                                     * "simulation_id": "sim_xxxx",
                                                                                                                                                                                                                                                     * "runner_status": "running",
                                                                                                                                                                                                                                                     * "current_round": 5,
                                                                                                                                                                                                                                                     * ...
                                                                                                                                                                                                                                                     * "all_actions": [
                                                                                                                                                                                                                                                         * {
                                                                                                                                                                                                                                                             * "round_num": 5,
                                                                                                                                                                                                                                                             * "timestamp": "2025-12-01T10:30:00",
                                                                                                                                                                                                                                                             * "platform": "twitter",
                                                                                                                                                                                                                                                             * "agent_id": 3,
                                                                                                                                                                                                                                                             * "agent_name": "Agent Name",
                                                                                                                                                                                                                                                             * "action_type": "CREATE_POST",
                                                                                                                                                                                                                                                             * "action_args": {"content": "..."},
                                                                                                                                                                                                                                                             * "result": null,
                                                                                                                                                                                                                                                             * "success": true
                                                                                                                                                                                                                                                             * },
                                                                                                                                                                                                                                                             * ...
                                                                                                                                                                                                                                                             * ],
                                                                                                                                                                                                                                                             * "twitter_actions": [...],  # Twitter 平台的所有动作
                                                                                                                                                                                                                                                             * "reddit_actions": [...]    # Reddit 平台的所有动作
                                                                                                                                                                                                                                                             * }
                                                                                                                                                                                                                                                             * }
                                                                                                                                                                                                                                                             * @param simulationId
                                                                                                                                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                                                             * @throws ApiError
                                                                                                                                                                                                                                                             */
                                                                                                                                                                                                                                                            public static simulationGetRunStatusDetailGet(
                                                                                                                                                                                                                                                                simulationId: string,
                                                                                                                                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                                                                                                                    method: 'GET',
                                                                                                                                                                                                                                                                    url: '/api/simulation/{simulation_id}/run-status/detail',
                                                                                                                                                                                                                                                                    path: {
                                                                                                                                                                                                                                                                        'simulation_id': simulationId,
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                    errors: {
                                                                                                                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                            /**
                                                                                                                                                                                                                                                             * 获取模拟时间线（按轮次汇总）
                                                                                                                                                                                                                                                             * 获取模拟时间线（按轮次汇总）
                                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                                             * 用于前端展示进度条和时间线视图
                                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                                             * Query参数：
                                                                                                                                                                                                                                                             * start_round: 起始轮次（默认0）
                                                                                                                                                                                                                                                             * end_round: 结束轮次（默认全部）
                                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                                             * 返回每轮的汇总信息
                                                                                                                                                                                                                                                             * @param simulationId
                                                                                                                                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                                                                                                                                             * @throws ApiError
                                                                                                                                                                                                                                                             */
                                                                                                                                                                                                                                                            public static simulationGetSimulationTimelineGet(
                                                                                                                                                                                                                                                                simulationId: string,
                                                                                                                                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                                                                                                                    method: 'GET',
                                                                                                                                                                                                                                                                    url: '/api/simulation/{simulation_id}/timeline',
                                                                                                                                                                                                                                                                    path: {
                                                                                                                                                                                                                                                                        'simulation_id': simulationId,
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                    errors: {
                                                                                                                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
