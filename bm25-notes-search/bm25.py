"""Minimal BM25 ranker — no external dependencies."""

from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass

TOKEN_RE = re.compile(r"[a-z0-9]+")


def tokenize(text: str) -> list[str]:
    return TOKEN_RE.findall(text.lower())


@dataclass
class Document:
    doc_id: str
    path: str
    text: str
    tokens: list[str]
    length: int


class BM25Index:
    """Okapi BM25 over a small corpus of text documents."""

    def __init__(self, documents: list[Document], *, k1: float = 1.5, b: float = 0.75) -> None:
        self.documents = documents
        self.k1 = k1
        self.b = b
        self.n_docs = len(documents)
        self.avg_dl = sum(d.length for d in documents) / self.n_docs if documents else 0.0
        self.df: dict[str, int] = {}
        self.tf: list[Counter[str]] = []

        for doc in documents:
            counts = Counter(doc.tokens)
            self.tf.append(counts)
            for term in counts:
                self.df[term] = self.df.get(term, 0) + 1

    def _idf(self, term: str) -> float:
        df = self.df.get(term, 0)
        if df == 0:
            return 0.0
        return math.log(1 + (self.n_docs - df + 0.5) / (df + 0.5))

    def score(self, query_tokens: list[str]) -> list[tuple[float, Document]]:
        if not query_tokens or not self.documents:
            return []

        scores: list[tuple[float, Document]] = []
        for idx, doc in enumerate(self.documents):
            total = 0.0
            tf_doc = self.tf[idx]
            for term in query_tokens:
                freq = tf_doc.get(term, 0)
                if freq == 0:
                    continue
                idf = self._idf(term)
                denom = freq + self.k1 * (1 - self.b + self.b * doc.length / self.avg_dl)
                total += idf * (freq * (self.k1 + 1)) / denom
            if total > 0:
                scores.append((total, doc))

        scores.sort(key=lambda item: item[0], reverse=True)
        return scores
