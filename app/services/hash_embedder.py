"""
本地哈希向量 Embedder

当上游 OpenAI 兼容端点不提供 embeddings 模型时，作为 Graphiti 的保底实现。
"""

from __future__ import annotations

import hashlib
import math
import re
from collections.abc import Iterable

from graphiti_core.embedder.client import EMBEDDING_DIM, EmbedderClient


class LocalHashEmbedder(EmbedderClient):
    """基于 token 哈希的确定性向量器"""

    token_pattern = re.compile(r'\w+', re.UNICODE)

    def _embed_text(self, text: str) -> list[float]:
        vector = [0.0] * EMBEDDING_DIM
        tokens = self.token_pattern.findall((text or '').lower())
        if not tokens:
            return vector

        for token in tokens:
            digest = hashlib.sha256(token.encode('utf-8')).digest()
            bucket = int.from_bytes(digest[:4], 'big') % EMBEDDING_DIM
            sign = 1.0 if digest[4] % 2 == 0 else -1.0
            weight = 1.0 + (digest[5] / 255.0)
            vector[bucket] += sign * weight

        norm = math.sqrt(sum(value * value for value in vector))
        if norm == 0:
            return vector
        return [value / norm for value in vector]

    async def create(
        self, input_data: str | list[str] | Iterable[int] | Iterable[Iterable[int]]
    ) -> list[float]:
        if isinstance(input_data, str):
            return self._embed_text(input_data)
        if isinstance(input_data, list) and input_data and isinstance(input_data[0], str):
            return self._embed_text(input_data[0])
        return self._embed_text(str(input_data))

    async def create_batch(self, input_data_list: list[str]) -> list[list[float]]:
        return [self._embed_text(item) for item in input_data_list]


class FallbackEmbedder(EmbedderClient):
    """优先远端 embeddings，失败时退化到本地哈希向量"""

    def __init__(self, primary: EmbedderClient, fallback: EmbedderClient):
        self.primary = primary
        self.fallback = fallback
        self._warned = False

    def _warn_once(self, error: Exception):
        if not self._warned:
            self._warned = True
            from ..utils.logger import get_logger

            get_logger('mirofish.graphiti_embedder').warning(
                'Remote embeddings unavailable; falling back to LocalHashEmbedder: %s',
                error,
            )

    async def create(
        self, input_data: str | list[str] | Iterable[int] | Iterable[Iterable[int]]
    ) -> list[float]:
        try:
            return await self.primary.create(input_data)
        except Exception as error:
            self._warn_once(error)
            return await self.fallback.create(input_data)

    async def create_batch(self, input_data_list: list[str]) -> list[list[float]]:
        try:
            return await self.primary.create_batch(input_data_list)
        except Exception as error:
            self._warn_once(error)
            return await self.fallback.create_batch(input_data_list)
