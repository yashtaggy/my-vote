"""
Redis caching layer with graceful fallback to in-memory dict
when Redis is unavailable (for local dev).
"""

import json
import asyncio
from typing import Any, Optional
from datetime import datetime

try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.core.config import settings

# In-memory fallback cache
_memory_cache: dict = {}
_cache_ttls: dict = {}

_redis_client = None


async def get_redis():
    global _redis_client
    if not REDIS_AVAILABLE:
        return None
    if _redis_client is None:
        try:
            _redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            await _redis_client.ping()
        except Exception:
            _redis_client = None
    return _redis_client


async def cache_get(key: str) -> Optional[Any]:
    client = await get_redis()
    if client:
        try:
            val = await client.get(key)
            return json.loads(val) if val else None
        except Exception:
            pass
    # Memory fallback
    entry = _memory_cache.get(key)
    if entry is None:
        return None
    ttl = _cache_ttls.get(key)
    if ttl and datetime.utcnow().timestamp() > ttl:
        _memory_cache.pop(key, None)
        return None
    return entry


async def cache_set(key: str, value: Any, ttl: int = 300):
    client = await get_redis()
    if client:
        try:
            await client.setex(key, ttl, json.dumps(value))
            return
        except Exception:
            pass
    # Memory fallback
    _memory_cache[key] = value
    _cache_ttls[key] = datetime.utcnow().timestamp() + ttl


async def cache_delete(key: str):
    client = await get_redis()
    if client:
        try:
            await client.delete(key)
        except Exception:
            pass
    _memory_cache.pop(key, None)
