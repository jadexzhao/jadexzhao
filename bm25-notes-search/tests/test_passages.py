import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from passages import load_passages, split_markdown


class SplitTests(unittest.TestCase):
    def test_heading_becomes_a_passage(self):
        text = "# Title\n\nA long note does not automatically win.\n"
        passages = split_markdown(text, "bm25-basics.md")
        self.assertEqual(len(passages), 1)
        self.assertEqual(passages[0].heading, "Title")
        self.assertIn("automatically win", passages[0].text)
        self.assertTrue(passages[0].citation.startswith("bm25-basics.md"))

    def test_empty_file_yields_nothing(self):
        self.assertEqual(split_markdown("   \n", "empty.md"), [])


class LoadTests(unittest.TestCase):
    def test_missing_directory(self):
        with self.assertRaises(FileNotFoundError):
            load_passages(Path("/tmp/jadexzhao-missing-notes"))

    def test_skips_empty_markdown(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "empty.md").write_text("\n", encoding="utf-8")
            (root / "ok.md").write_text("# Hello\n\nworld\n", encoding="utf-8")
            loaded = load_passages(root)
            self.assertEqual([item.path for item in loaded], ["ok.md"])


if __name__ == "__main__":
    unittest.main()
