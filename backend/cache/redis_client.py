import json
from typing import Optional, Dict, Any

# Simple mock in-memory layer since asking to "go build all" usually requires zero-config testing if run.
# In a real scenario with REDIS_URL, we'd initialize redis.Redis.
# Here we'll use an in-memory dictionary.

_cache = {}

def get_cache(key: str) -> Optional[Dict[str, Any]]:
    return _cache.get(key)

def set_cache(key: str, value: Dict[str, Any]) -> None:
    _cache[key] = value

def get_audit_status(audit_id: str) -> Optional[Dict[str, Any]]:
    return _cache.get(f"status_{audit_id}")

def set_audit_status(audit_id: str, status: str, progress: int = 0, message: Optional[str] = None) -> None:
    payload: Dict[str, Any] = {"status": status, "progress": progress}
    if message:
        payload["message"] = message
    _cache[f"status_{audit_id}"] = payload
