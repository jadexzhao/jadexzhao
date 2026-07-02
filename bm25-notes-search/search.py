#!/usr/bin/env python3
"""Search markdown notes with BM25 ranking."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from bm25 import BM25Index, Document, tokenize

SNIPPET_LINES = 2


def load_markdown_docs(root: Path) -> list[Document]:
    docs: list[Document] = []
    for path in sorted(root.rglob("*.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        tokens = tokenize(text)
        if not tokens:
            continue
        rel = path.relative_to(root)
        docs.append(
            Document(
                doc_id=str(rel),
                path=str(rel),
                text=text,
                tokens=tokens,
                length=len(tokens),
            )
        )
    return docs


def best_snippet(text: str, query_tokens: list[str]) -> str:
    lines = text.splitlines()
    query = set(query_tokens)
    best_score = -1
    best_idx = 0

    for idx, line in enumerate(lines):
        line_tokens = set(tokenize(line))
        overlap = len(query & line_tokens)
        if overlap > best_score:
            best_score = overlap
            best_idx = idx

    start = max(0, best_idx - SNIPPET_LINES)
    end = min(len(lines), best_idx + SNIPPET_LINES + 1)
    snippet = "\n".join(line.strip() for line in lines[start:end] if line.strip())
    return snippet.replace("\n", " · ")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="BM25 keyword search over markdown notes (stdlib only)."
    )
    parser.add_argument(
        "directory",
        type=Path,
        help="Root folder to scan recursively for .md files",
    )
    parser.add_argument("query", help="Search query (space-separated keywords)")
    parser.add_argument(
        "--top",
        type=int,
        default=5,
        help="Number of results to show (default: 5)",
    )
    args = parser.parse_args(argv)

    root = args.directory.expanduser().resolve()
    if not root.is_dir():
        print(f"Not a directory: {root}", file=sys.stderr)
        return 1

    docs = load_markdown_docs(root)
    if not docs:
        print(f"No markdown files under {root}", file=sys.stderr)
        return 1

    query_tokens = tokenize(args.query)
    if not query_tokens:
        print("Query has no searchable tokens.", file=sys.stderr)
        return 1

    index = BM25Index(docs)
    results = index.score(query_tokens)[: args.top]

    print(f"Indexed {len(docs)} markdown files in {root}")
    print(f'Query: "{args.query}" → tokens: {query_tokens}\n')

    if not results:
        print("No matches.")
        return 0

    for rank, (score, doc) in enumerate(results, start=1):
        snippet = best_snippet(doc.text, query_tokens)
        print(f"{rank}. score={score:.3f}  {doc.path}")
        print(f"   {snippet}\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
