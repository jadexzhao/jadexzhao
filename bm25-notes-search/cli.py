#!/usr/bin/env python3
"""Dispatcher for the notes-search tools.

Examples (from this folder):

    python3 cli.py search fixtures "accessibility"
    python3 cli.py ask fixtures "What days is the family restaurant open?"
    python3 cli.py models
"""

from __future__ import annotations

import argparse
import sys

import ask as ask_mod
import search as search_mod
from ollama_client import DEFAULT_HOST, DEFAULT_MODEL, OllamaError, list_models


def cmd_models(host: str) -> int:
    try:
        names = list_models(host)
    except OllamaError as exc:
        print(exc, file=sys.stderr)
        print(
            "Search still works without Ollama: python3 cli.py search fixtures \"long note\"",
            file=sys.stderr,
        )
        return 1
    if not names:
        print(f"Ollama is reachable at {host}, but no models are installed.")
        print(f"This tool will not download one. If you want {DEFAULT_MODEL}:")
        print(f"  ollama pull {DEFAULT_MODEL}")
        return 0
    print(f"Local models at {host}:")
    for name in names:
        print(f"- {name}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="BM25 notes search, with optional local-model ask."
    )
    sub = parser.add_subparsers(dest="command", required=True)

    search_p = sub.add_parser("search", help="File-level BM25 keyword search")
    search_p.add_argument("directory")
    search_p.add_argument("query")
    search_p.add_argument("--top", type=int, default=5)

    ask_p = sub.add_parser("ask", help="Passage BM25, optional local-model answer")
    ask_p.add_argument("directory")
    ask_p.add_argument("query")
    ask_p.add_argument("--top", type=int, default=3)
    ask_p.add_argument("--model", default=DEFAULT_MODEL)
    ask_p.add_argument("--host", default=DEFAULT_HOST)
    ask_p.add_argument("--retrieve-only", action="store_true")

    models_p = sub.add_parser("models", help="List local Ollama models (no download)")
    models_p.add_argument("--host", default=DEFAULT_HOST)

    args = parser.parse_args(argv)

    if args.command == "search":
        return search_mod.main([args.directory, args.query, "--top", str(args.top)])
    if args.command == "ask":
        ask_args = [args.directory, args.query, "--top", str(args.top), "--host", args.host, "--model", args.model]
        if args.retrieve_only:
            ask_args.append("--retrieve-only")
        return ask_mod.main(ask_args)
    if args.command == "models":
        return cmd_models(args.host)
    raise SystemExit(f"Unknown command: {args.command}")


if __name__ == "__main__":
    raise SystemExit(main())
