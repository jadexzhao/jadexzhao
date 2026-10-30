"""Local-only Ollama HTTP client. Never pulls models."""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from urllib.parse import urlparse

DEFAULT_HOST = "http://127.0.0.1:11434"
DEFAULT_MODEL = "qwen3:4b"
GENERATE_TIMEOUT = 120
TAGS_TIMEOUT = 5
LOCAL_HOSTNAMES = {"127.0.0.1", "localhost", "::1"}


class OllamaError(Exception):
    """Connection, host, or response problem. Not a ranking failure."""


def assert_local_host(host: str) -> str:
    parsed = urlparse(host)
    hostname = (parsed.hostname or "").lower()
    if parsed.scheme not in {"http", "https"} or hostname not in LOCAL_HOSTNAMES:
        raise OllamaError(
            f"Refusing non-local host {host!r}. This client only talks to localhost."
        )
    return host.rstrip("/")


def list_models(host: str = DEFAULT_HOST) -> list[str]:
    base = assert_local_host(host)
    request = urllib.request.Request(base + "/api/tags", method="GET")
    try:
        with urllib.request.urlopen(request, timeout=TAGS_TIMEOUT) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as exc:
        raise OllamaError(f"Ollama not reachable at {base} ({exc.reason})") from exc
    except TimeoutError as exc:
        raise OllamaError(f"Ollama timed out at {base}") from exc
    except json.JSONDecodeError as exc:
        raise OllamaError("Ollama /api/tags did not return JSON") from exc

    names: list[str] = []
    for item in body.get("models") or []:
        name = item.get("name")
        if name:
            names.append(str(name))
    return names


def generate_answer(
    *,
    system: str,
    prompt: str,
    host: str = DEFAULT_HOST,
    model: str = DEFAULT_MODEL,
) -> str:
    base = assert_local_host(host)
    payload = json.dumps(
        {
            "model": model,
            "system": system,
            "prompt": prompt,
            "stream": False,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        base + "/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=GENERATE_TIMEOUT) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise OllamaError(
            f"Ollama generate failed ({exc.code}). "
            f"If the model is missing, install it yourself with: ollama pull {model}"
        ) from exc
    except urllib.error.URLError as exc:
        raise OllamaError(f"Ollama not reachable at {base} ({exc.reason})") from exc
    except TimeoutError as exc:
        raise OllamaError(f"Ollama generate timed out after {GENERATE_TIMEOUT}s") from exc
    except json.JSONDecodeError as exc:
        raise OllamaError("Ollama generate did not return JSON") from exc

    error = body.get("error")
    if error:
        raise OllamaError(str(error))
    return str(body.get("response") or "").strip()


def parse_generate_response(body: dict) -> str:
    if not isinstance(body, dict):
        raise OllamaError("Generate response must be an object")
    if body.get("error"):
        raise OllamaError(str(body["error"]))
    return str(body.get("response") or "").strip()
