# BM25 Notes Search

A tiny keyword search engine over local markdown files (**stdlib only**, no API keys.

Inspired by [Build Your Own X - search engine](https://github.com/codecrafters-io/build-your-own-x#search-engine) and the retrieval slice of [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) (chunk + rank, without embeddings).

## What it does

1. Recursively loads `.md` files from a folder you point at
2. Tokenizes and indexes them with **Okapi BM25**
3. Ranks documents by keyword relevance and prints a short snippet

Useful for grepping project notes, meeting docs, and team markdown without opening every file.

## Run

```bash
cd bm25-notes-search

# Search any local markdown folder
python3 search.py \
  ../full-stack-web-features \
  "accessibility wcag responsive layout"

python3 search.py \
  ../online-ordering-system \
  "formspree contact seasonal content"
```

Options:

- `--top N`: show top N results (default 5)

## Files

| File | Role |
|------|------|
| `bm25.py` | BM25 index + scoring (~60 lines) |
| `search.py` | CLI: load markdown, search, print snippets |

## Not included (on purpose)

- Vector embeddings / RAG API calls
- Web UI
- Index persistence (rebuilds on each run; fine for ~50 notes)
