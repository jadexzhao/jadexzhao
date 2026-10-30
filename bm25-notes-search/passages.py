"""Split markdown into traceable passages for retrieval."""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from bm25 import Document, tokenize

HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
MAX_PASSAGE_CHARS = 1200


@dataclass
class Passage:
    path: str
    heading: str
    text: str
    start_line: int

    @property
    def citation(self) -> str:
        if self.heading:
            return f"{self.path} (L{self.start_line}, {self.heading})"
        return f"{self.path} (L{self.start_line})"

    def to_document(self) -> Document:
        tokens = tokenize(self.text)
        return Document(
            doc_id=f"{self.path}:{self.start_line}",
            path=self.citation,
            text=self.text,
            tokens=tokens,
            length=len(tokens),
        )


def split_markdown(text: str, rel_path: str) -> list[Passage]:
    """Split on headings, then on blank lines if a section is long."""
    if not text.strip():
        return []

    sections: list[tuple[int, str, str]] = []
    heading = ""
    start_line = 1
    buf: list[str] = []

    def flush() -> None:
        body = "\n".join(buf).strip()
        if body:
            sections.append((start_line, heading, body))

    for idx, line in enumerate(text.splitlines(), start=1):
        match = HEADING_RE.match(line)
        if match and buf:
            flush()
            heading = match.group(2).strip()
            start_line = idx
            buf = [line]
        else:
            if match:
                heading = match.group(2).strip()
                start_line = idx
            buf.append(line)
    flush()

    passages: list[Passage] = []
    for sec_start, sec_heading, body in sections:
        for piece_start, piece in _split_long(body, sec_start):
            if not tokenize(piece):
                continue
            passages.append(
                Passage(
                    path=rel_path,
                    heading=sec_heading,
                    text=piece,
                    start_line=piece_start,
                )
            )
    return passages


def _split_long(body: str, start_line: int) -> list[tuple[int, str]]:
    if len(body) <= MAX_PASSAGE_CHARS:
        return [(start_line, body)]

    parts: list[tuple[int, str]] = []
    cursor = start_line
    current: list[str] = []
    current_start = cursor

    def emit() -> None:
        text = "\n".join(current).strip()
        if text:
            parts.append((current_start, text))

    for line in body.splitlines():
        current.append(line)
        if line.strip() == "" and len("\n".join(current)) >= MAX_PASSAGE_CHARS // 2:
            emit()
            current = []
            current_start = cursor + 1
        cursor += 1
    emit()
    return parts or [(start_line, body)]


def load_passages(root: Path) -> list[Passage]:
    passages: list[Passage] = []
    if not root.is_dir():
        raise FileNotFoundError(str(root))
    for path in sorted(root.rglob("*.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        rel = str(path.relative_to(root))
        passages.extend(split_markdown(text, rel))
    return passages


def passages_as_documents(passages: list[Passage]) -> list[Document]:
    return [item.to_document() for item in passages]
