/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GenerateReportRequest } from '../models/GenerateReportRequest';
import type { GenerateReportResponse } from '../models/GenerateReportResponse';
import type { GenerateReportStatusRequest } from '../models/GenerateReportStatusRequest';
import type { MessageEnvelope } from '../models/MessageEnvelope';
import type { ReportBySimulationResponse } from '../models/ReportBySimulationResponse';
import type { ReportListResponse } from '../models/ReportListResponse';
import type { ReportResponse } from '../models/ReportResponse';
import type { ReportTaskStatusResponse } from '../models/ReportTaskStatusResponse';
import type { SuccessEnvelope } from '../models/SuccessEnvelope';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportService {
    /**
     * Get report by simulation
     * 根据模拟ID获取报告
     *
     * 返回：
     * {
         * "success": true,
         * "data": {
             * "report_id": "report_xxxx",
             * ...
             * }
             * }
             * @param simulationId
             * @returns ReportBySimulationResponse Successful response.
             * @throws ApiError
             */
            public static reportGetReportBySimulationGet(
                simulationId: string,
            ): CancelablePromise<ReportBySimulationResponse> {
                return __request(OpenAPI, {
                    method: 'GET',
                    url: '/api/report/by-simulation/{simulation_id}',
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
             * 与Report Agent对话
             * 与Report Agent对话
             *
             * Report Agent可以在对话中自主调用检索工具来回答问题
             *
             * 请求（JSON）：
             * {
                 * "simulation_id": "sim_xxxx",        // 必填，模拟ID
                 * "message": "请解释一下舆情走向",    // 必填，用户消息
                 * "chat_history": [                   // 可选，对话历史
                 * {"role": "user", "content": "..."},
                 * {"role": "assistant", "content": "..."}
                 * ]
                 * }
                 *
                 * 返回：
                 * {
                     * "success": true,
                     * "data": {
                         * "response": "Agent回复...",
                         * "tool_calls": [调用的工具列表],
                         * "sources": [信息来源]
                         * }
                         * }
                         * @param requestBody
                         * @returns SuccessEnvelope Successful response.
                         * @throws ApiError
                         */
                        public static reportChatWithReportAgentPost(
                            requestBody: Record<string, any>,
                        ): CancelablePromise<SuccessEnvelope> {
                            return __request(OpenAPI, {
                                method: 'POST',
                                url: '/api/report/chat',
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
                         * 检查模拟是否有报告，以及报告状态
                         * 检查模拟是否有报告，以及报告状态
                         *
                         * 用于前端判断是否解锁Interview功能
                         *
                         * 返回：
                         * {
                             * "success": true,
                             * "data": {
                                 * "simulation_id": "sim_xxxx",
                                 * "has_report": true,
                                 * "report_status": "completed",
                                 * "report_id": "report_xxxx",
                                 * "interview_unlocked": true
                                 * }
                                 * }
                                 * @param simulationId
                                 * @returns SuccessEnvelope Successful response.
                                 * @throws ApiError
                                 */
                                public static reportCheckReportStatusGet(
                                    simulationId: string,
                                ): CancelablePromise<SuccessEnvelope> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/report/check/{simulation_id}',
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
                                 * Generate report
                                 * 生成模拟分析报告（异步任务）
                                 *
                                 * 这是一个耗时操作，接口会立即返回task_id，
                                 * 使用 GET /api/report/generate/status 查询进度
                                 *
                                 * 请求（JSON）：
                                 * {
                                     * "simulation_id": "sim_xxxx",    // 必填，模拟ID
                                     * "force_regenerate": false        // 可选，强制重新生成
                                     * }
                                     *
                                     * 返回：
                                     * {
                                         * "success": true,
                                         * "data": {
                                             * "simulation_id": "sim_xxxx",
                                             * "task_id": "task_xxxx",
                                             * "status": "generating",
                                             * "message": "报告生成任务已启动"
                                             * }
                                             * }
                                             * @param requestBody
                                             * @returns GenerateReportResponse Successful response.
                                             * @throws ApiError
                                             */
                                            public static reportGenerateReportPost(
                                                requestBody: GenerateReportRequest,
                                            ): CancelablePromise<GenerateReportResponse> {
                                                return __request(OpenAPI, {
                                                    method: 'POST',
                                                    url: '/api/report/generate',
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
                                             * Get report generation status
                                             * 查询报告生成任务进度
                                             *
                                             * 请求（JSON）：
                                             * {
                                                 * "task_id": "task_xxxx",         // 可选，generate返回的task_id
                                                 * "simulation_id": "sim_xxxx"     // 可选，模拟ID
                                                 * }
                                                 *
                                                 * 返回：
                                                 * {
                                                     * "success": true,
                                                     * "data": {
                                                         * "task_id": "task_xxxx",
                                                         * "status": "processing|completed|failed",
                                                         * "progress": 45,
                                                         * "message": "..."
                                                         * }
                                                         * }
                                                         * @param requestBody
                                                         * @returns ReportTaskStatusResponse Successful response.
                                                         * @throws ApiError
                                                         */
                                                        public static reportGetGenerateStatusPost(
                                                            requestBody: GenerateReportStatusRequest,
                                                        ): CancelablePromise<ReportTaskStatusResponse> {
                                                            return __request(OpenAPI, {
                                                                method: 'POST',
                                                                url: '/api/report/generate/status',
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
                                                         * List reports
                                                         * 列出所有报告
                                                         *
                                                         * Query参数：
                                                         * simulation_id: 按模拟ID过滤（可选）
                                                         * limit: 返回数量限制（默认50）
                                                         *
                                                         * 返回：
                                                         * {
                                                             * "success": true,
                                                             * "data": [...],
                                                             * "count": 10
                                                             * }
                                                             * @param simulationId Optional simulation id to filter reports.
                                                             * @param limit Maximum number of reports to return.
                                                             * @returns ReportListResponse Successful response.
                                                             * @throws ApiError
                                                             */
                                                            public static reportListReportsGet(
                                                                simulationId?: string,
                                                                limit: number = 50,
                                                            ): CancelablePromise<ReportListResponse> {
                                                                return __request(OpenAPI, {
                                                                    method: 'GET',
                                                                    url: '/api/report/list',
                                                                    query: {
                                                                        'simulation_id': simulationId,
                                                                        'limit': limit,
                                                                    },
                                                                    errors: {
                                                                        404: `Referenced resource was not found.`,
                                                                        500: `Unhandled backend error.`,
                                                                    },
                                                                });
                                                            }
                                                            /**
                                                             * 图谱搜索工具接口（供调试使用）
                                                             * 图谱搜索工具接口（供调试使用）
                                                             *
                                                             * 请求（JSON）：
                                                             * {
                                                                 * "graph_id": "mirofish_xxxx",
                                                                 * "query": "搜索查询",
                                                                 * "limit": 10
                                                                 * }
                                                                 * @param requestBody
                                                                 * @returns SuccessEnvelope Successful response.
                                                                 * @throws ApiError
                                                                 */
                                                                public static reportSearchGraphToolPost(
                                                                    requestBody: Record<string, any>,
                                                                ): CancelablePromise<SuccessEnvelope> {
                                                                    return __request(OpenAPI, {
                                                                        method: 'POST',
                                                                        url: '/api/report/tools/search',
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
                                                                 * 图谱统计工具接口（供调试使用）
                                                                 * 图谱统计工具接口（供调试使用）
                                                                 *
                                                                 * 请求（JSON）：
                                                                 * {
                                                                     * "graph_id": "mirofish_xxxx"
                                                                     * }
                                                                     * @param requestBody
                                                                     * @returns SuccessEnvelope Successful response.
                                                                     * @throws ApiError
                                                                     */
                                                                    public static reportGetGraphStatisticsToolPost(
                                                                        requestBody: Record<string, any>,
                                                                    ): CancelablePromise<SuccessEnvelope> {
                                                                        return __request(OpenAPI, {
                                                                            method: 'POST',
                                                                            url: '/api/report/tools/statistics',
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
                                                                     * 删除报告
                                                                     * 删除报告
                                                                     * @param reportId
                                                                     * @returns MessageEnvelope Successful response.
                                                                     * @throws ApiError
                                                                     */
                                                                    public static reportDeleteReportDelete(
                                                                        reportId: string,
                                                                    ): CancelablePromise<MessageEnvelope> {
                                                                        return __request(OpenAPI, {
                                                                            method: 'DELETE',
                                                                            url: '/api/report/{report_id}',
                                                                            path: {
                                                                                'report_id': reportId,
                                                                            },
                                                                            errors: {
                                                                                404: `Referenced resource was not found.`,
                                                                                500: `Unhandled backend error.`,
                                                                            },
                                                                        });
                                                                    }
                                                                    /**
                                                                     * Get report detail
                                                                     * 获取报告详情
                                                                     *
                                                                     * 返回：
                                                                     * {
                                                                         * "success": true,
                                                                         * "data": {
                                                                             * "report_id": "report_xxxx",
                                                                             * "simulation_id": "sim_xxxx",
                                                                             * "status": "completed",
                                                                             * "outline": {...},
                                                                             * "markdown_content": "...",
                                                                             * "created_at": "...",
                                                                             * "completed_at": "..."
                                                                             * }
                                                                             * }
                                                                             * @param reportId
                                                                             * @returns ReportResponse Successful response.
                                                                             * @throws ApiError
                                                                             */
                                                                            public static reportGetReportGet(
                                                                                reportId: string,
                                                                            ): CancelablePromise<ReportResponse> {
                                                                                return __request(OpenAPI, {
                                                                                    method: 'GET',
                                                                                    url: '/api/report/{report_id}',
                                                                                    path: {
                                                                                        'report_id': reportId,
                                                                                    },
                                                                                    errors: {
                                                                                        404: `Referenced resource was not found.`,
                                                                                        500: `Unhandled backend error.`,
                                                                                    },
                                                                                });
                                                                            }
                                                                            /**
                                                                             * 获取 Report Agent 的详细执行日志
                                                                             * 获取 Report Agent 的详细执行日志
                                                                             *
                                                                             * 实时获取报告生成过程中的每一步动作，包括：
                                                                             * - 报告开始、规划开始/完成
                                                                             * - 每个章节的开始、工具调用、LLM响应、完成
                                                                             * - 报告完成或失败
                                                                             *
                                                                             * Query参数：
                                                                             * from_line: 从第几行开始读取（可选，默认0，用于增量获取）
                                                                             *
                                                                             * 返回：
                                                                             * {
                                                                                 * "success": true,
                                                                                 * "data": {
                                                                                     * "logs": [
                                                                                         * {
                                                                                             * "timestamp": "2025-12-13T...",
                                                                                             * "elapsed_seconds": 12.5,
                                                                                             * "report_id": "report_xxxx",
                                                                                             * "action": "tool_call",
                                                                                             * "stage": "generating",
                                                                                             * "section_title": "执行摘要",
                                                                                             * "section_index": 1,
                                                                                             * "details": {
                                                                                                 * "tool_name": "insight_forge",
                                                                                                 * "parameters": {...},
                                                                                                 * ...
                                                                                                 * }
                                                                                                 * },
                                                                                                 * ...
                                                                                                 * ],
                                                                                                 * "total_lines": 25,
                                                                                                 * "from_line": 0,
                                                                                                 * "has_more": false
                                                                                                 * }
                                                                                                 * }
                                                                                                 * @param reportId
                                                                                                 * @returns SuccessEnvelope Successful response.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static reportGetAgentLogGet(
                                                                                                    reportId: string,
                                                                                                ): CancelablePromise<SuccessEnvelope> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'GET',
                                                                                                        url: '/api/report/{report_id}/agent-log',
                                                                                                        path: {
                                                                                                            'report_id': reportId,
                                                                                                        },
                                                                                                        errors: {
                                                                                                            404: `Referenced resource was not found.`,
                                                                                                            500: `Unhandled backend error.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * 获取完整的 Agent 日志（一次性获取全部）
                                                                                                 * 获取完整的 Agent 日志（一次性获取全部）
                                                                                                 *
                                                                                                 * 返回：
                                                                                                 * {
                                                                                                     * "success": true,
                                                                                                     * "data": {
                                                                                                         * "logs": [...],
                                                                                                         * "count": 25
                                                                                                         * }
                                                                                                         * }
                                                                                                         * @param reportId
                                                                                                         * @returns string Successful response.
                                                                                                         * @throws ApiError
                                                                                                         */
                                                                                                        public static reportStreamAgentLogGet(
                                                                                                            reportId: string,
                                                                                                        ): CancelablePromise<string> {
                                                                                                            return __request(OpenAPI, {
                                                                                                                method: 'GET',
                                                                                                                url: '/api/report/{report_id}/agent-log/stream',
                                                                                                                path: {
                                                                                                                    'report_id': reportId,
                                                                                                                },
                                                                                                                errors: {
                                                                                                                    404: `Referenced resource was not found.`,
                                                                                                                    500: `Unhandled backend error.`,
                                                                                                                },
                                                                                                            });
                                                                                                        }
                                                                                                        /**
                                                                                                         * 获取 Report Agent 的控制台输出日志
                                                                                                         * 获取 Report Agent 的控制台输出日志
                                                                                                         *
                                                                                                         * 实时获取报告生成过程中的控制台输出（INFO、WARNING等），
                                                                                                         * 这与 agent-log 接口返回的结构化 JSON 日志不同，
                                                                                                         * 是纯文本格式的控制台风格日志。
                                                                                                         *
                                                                                                         * Query参数：
                                                                                                         * from_line: 从第几行开始读取（可选，默认0，用于增量获取）
                                                                                                         *
                                                                                                         * 返回：
                                                                                                         * {
                                                                                                             * "success": true,
                                                                                                             * "data": {
                                                                                                                 * "logs": [
                                                                                                                     * "[19:46:14] INFO: 搜索完成: 找到 15 条相关事实",
                                                                                                                     * "[19:46:14] INFO: 图谱搜索: graph_id=xxx, query=...",
                                                                                                                     * ...
                                                                                                                     * ],
                                                                                                                     * "total_lines": 100,
                                                                                                                     * "from_line": 0,
                                                                                                                     * "has_more": false
                                                                                                                     * }
                                                                                                                     * }
                                                                                                                     * @param reportId
                                                                                                                     * @returns SuccessEnvelope Successful response.
                                                                                                                     * @throws ApiError
                                                                                                                     */
                                                                                                                    public static reportGetConsoleLogGet(
                                                                                                                        reportId: string,
                                                                                                                    ): CancelablePromise<SuccessEnvelope> {
                                                                                                                        return __request(OpenAPI, {
                                                                                                                            method: 'GET',
                                                                                                                            url: '/api/report/{report_id}/console-log',
                                                                                                                            path: {
                                                                                                                                'report_id': reportId,
                                                                                                                            },
                                                                                                                            errors: {
                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                            },
                                                                                                                        });
                                                                                                                    }
                                                                                                                    /**
                                                                                                                     * 获取完整的控制台日志（一次性获取全部）
                                                                                                                     * 获取完整的控制台日志（一次性获取全部）
                                                                                                                     *
                                                                                                                     * 返回：
                                                                                                                     * {
                                                                                                                         * "success": true,
                                                                                                                         * "data": {
                                                                                                                             * "logs": [...],
                                                                                                                             * "count": 100
                                                                                                                             * }
                                                                                                                             * }
                                                                                                                             * @param reportId
                                                                                                                             * @returns string Successful response.
                                                                                                                             * @throws ApiError
                                                                                                                             */
                                                                                                                            public static reportStreamConsoleLogGet(
                                                                                                                                reportId: string,
                                                                                                                            ): CancelablePromise<string> {
                                                                                                                                return __request(OpenAPI, {
                                                                                                                                    method: 'GET',
                                                                                                                                    url: '/api/report/{report_id}/console-log/stream',
                                                                                                                                    path: {
                                                                                                                                        'report_id': reportId,
                                                                                                                                    },
                                                                                                                                    errors: {
                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                    },
                                                                                                                                });
                                                                                                                            }
                                                                                                                            /**
                                                                                                                             * 下载报告（Markdown格式）
                                                                                                                             * 下载报告（Markdown格式）
                                                                                                                             *
                                                                                                                             * 返回Markdown文件
                                                                                                                             * @param reportId
                                                                                                                             * @returns binary Successful response.
                                                                                                                             * @throws ApiError
                                                                                                                             */
                                                                                                                            public static reportDownloadReportGet(
                                                                                                                                reportId: string,
                                                                                                                            ): CancelablePromise<Blob> {
                                                                                                                                return __request(OpenAPI, {
                                                                                                                                    method: 'GET',
                                                                                                                                    url: '/api/report/{report_id}/download',
                                                                                                                                    path: {
                                                                                                                                        'report_id': reportId,
                                                                                                                                    },
                                                                                                                                    errors: {
                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                    },
                                                                                                                                });
                                                                                                                            }
                                                                                                                            /**
                                                                                                                             * 获取报告生成进度（实时）
                                                                                                                             * 获取报告生成进度（实时）
                                                                                                                             *
                                                                                                                             * 返回：
                                                                                                                             * {
                                                                                                                                 * "success": true,
                                                                                                                                 * "data": {
                                                                                                                                     * "status": "generating",
                                                                                                                                     * "progress": 45,
                                                                                                                                     * "message": "正在生成章节: 关键发现",
                                                                                                                                     * "current_section": "关键发现",
                                                                                                                                     * "completed_sections": ["执行摘要", "模拟背景"],
                                                                                                                                     * "updated_at": "2025-12-09T..."
                                                                                                                                     * }
                                                                                                                                     * }
                                                                                                                                     * @param reportId
                                                                                                                                     * @returns SuccessEnvelope Successful response.
                                                                                                                                     * @throws ApiError
                                                                                                                                     */
                                                                                                                                    public static reportGetReportProgressGet(
                                                                                                                                        reportId: string,
                                                                                                                                    ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                        return __request(OpenAPI, {
                                                                                                                                            method: 'GET',
                                                                                                                                            url: '/api/report/{report_id}/progress',
                                                                                                                                            path: {
                                                                                                                                                'report_id': reportId,
                                                                                                                                            },
                                                                                                                                            errors: {
                                                                                                                                                404: `Referenced resource was not found.`,
                                                                                                                                                500: `Unhandled backend error.`,
                                                                                                                                            },
                                                                                                                                        });
                                                                                                                                    }
                                                                                                                                    /**
                                                                                                                                     * 获取单个章节内容
                                                                                                                                     * 获取单个章节内容
                                                                                                                                     *
                                                                                                                                     * 返回：
                                                                                                                                     * {
                                                                                                                                         * "success": true,
                                                                                                                                         * "data": {
                                                                                                                                             * "filename": "section_01.md",
                                                                                                                                             * "content": "## 执行摘要\n\n..."
                                                                                                                                             * }
                                                                                                                                             * }
                                                                                                                                             * @param reportId
                                                                                                                                             * @param sectionIndex
                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                             * @throws ApiError
                                                                                                                                             */
                                                                                                                                            public static reportGetSingleSectionGet(
                                                                                                                                                reportId: string,
                                                                                                                                                sectionIndex: number,
                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                    method: 'GET',
                                                                                                                                                    url: '/api/report/{report_id}/section/{section_index}',
                                                                                                                                                    path: {
                                                                                                                                                        'report_id': reportId,
                                                                                                                                                        'section_index': sectionIndex,
                                                                                                                                                    },
                                                                                                                                                    errors: {
                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                    },
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                            /**
                                                                                                                                             * 获取已生成的章节列表（分章节输出）
                                                                                                                                             * 获取已生成的章节列表（分章节输出）
                                                                                                                                             *
                                                                                                                                             * 前端可以轮询此接口获取已生成的章节内容，无需等待整个报告完成
                                                                                                                                             *
                                                                                                                                             * 返回：
                                                                                                                                             * {
                                                                                                                                                 * "success": true,
                                                                                                                                                 * "data": {
                                                                                                                                                     * "report_id": "report_xxxx",
                                                                                                                                                     * "sections": [
                                                                                                                                                         * {
                                                                                                                                                             * "filename": "section_01.md",
                                                                                                                                                             * "section_index": 1,
                                                                                                                                                             * "content": "## 执行摘要\n\n..."
                                                                                                                                                             * },
                                                                                                                                                             * ...
                                                                                                                                                             * ],
                                                                                                                                                             * "total_sections": 3,
                                                                                                                                                             * "is_complete": false
                                                                                                                                                             * }
                                                                                                                                                             * }
                                                                                                                                                             * @param reportId
                                                                                                                                                             * @returns SuccessEnvelope Successful response.
                                                                                                                                                             * @throws ApiError
                                                                                                                                                             */
                                                                                                                                                            public static reportGetReportSectionsGet(
                                                                                                                                                                reportId: string,
                                                                                                                                                            ): CancelablePromise<SuccessEnvelope> {
                                                                                                                                                                return __request(OpenAPI, {
                                                                                                                                                                    method: 'GET',
                                                                                                                                                                    url: '/api/report/{report_id}/sections',
                                                                                                                                                                    path: {
                                                                                                                                                                        'report_id': reportId,
                                                                                                                                                                    },
                                                                                                                                                                    errors: {
                                                                                                                                                                        404: `Referenced resource was not found.`,
                                                                                                                                                                        500: `Unhandled backend error.`,
                                                                                                                                                                    },
                                                                                                                                                                });
                                                                                                                                                            }
                                                                                                                                                        }
