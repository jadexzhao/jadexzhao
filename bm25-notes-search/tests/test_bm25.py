import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from bm25 import BM25Index, Document, tokenize


class TokenizeTests(unittest.TestCase):
    def test_lowercases_and_keeps_alnum(self):
        self.assertEqual(tokenize("Tokenize INDEX!"), ["tokenize", "index"])

    def test_empty_string(self):
        self.assertEqual(tokenize(""), [])


class RankingTests(unittest.TestCase):
    def _index(self):
        docs = [
            Document("rare", "rare.md", "tokenize", tokenize("tokenize"), 1),
            Document(
                "common",
                "common.md",
                "note note note",
                tokenize("note note note"),
                3,
            ),
        ]
        return BM25Index(docs)

    def test_rare_term_ranks_its_document_first(self):
        ranked = self._index().score(["tokenize"])
        self.assertEqual(ranked[0][1].path, "rare.md")

    def test_unknown_term_returns_no_hits(self):
        self.assertEqual(self._index().score(["missing"]), [])

    def test_empty_query_returns_no_hits(self):
        self.assertEqual(self._index().score([]), [])


if __name__ == "__main__":
    unittest.main()
