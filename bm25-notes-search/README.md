# BM25 Notes Search

A tiny keyword search engine over local markdown files (**stdlib only**, no API keys).

Inspired by [Build Your Own X - search engine](https://github.com/codecrafters-io/build-your-own-x#search-engine) and the retrieval slice of [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) (chunk + rank, without embeddings).

## What it does

1. Recursively loads `.md` files from a folder you point at
2. Tokenizes and indexes them with **Okapi BM25**
3. Ranks documents by keyword relevance and prints a short snippet

Useful for grepping project notes, meeting docs, and team markdown without opening every file.

## Run (this is the product)

```bash
cd bm25-notes-search

# Search any local markdown folder
python3 search.py \
  fixtures \
  "how does ranking treat a long note"

python3 search.py \
  ../full-stack-web-features \
  "accessibility wcag responsive layout"
```

Options:

- `--top N`: show top N results (default 5)

`search.py` and `bm25.py` stay standard-library only. Do not add packages there.

## Optional experiment: retrieve, then ask a local model

`ask.py` uses the same BM25 ranker, then (only if a local model server is already running) drafts an answer from the retrieved notes.

```bash
# Retrieval only ... no model required
python3 ask.py fixtures "What days is the family restaurant open?" --retrieve-only

# Score the fixture questions (retrieval always; generation if the server is up)
python3 ask.py fixtures --eval eval_questions.json --retrieve-only

# After a local model is installed and serving
python3 ask.py fixtures "How does this BM25 ranker treat a long note?"
```

Defaults: `http://127.0.0.1:11434` and model name `qwen3:4b` (Ollama). If the server is down, the script still prints the ranked notes and exits cleanly.

This is not a chatbot product. The interesting check is whether the generated answer stays inside the retrieved notes, especially on the planted "grant number" question that is not in the corpus.

## Files

| File | Role |
|------|------|
| `bm25.py` | BM25 index + scoring (~60 lines) |
| `search.py` | CLI: load markdown, search, print snippets |
| `ask.py` | Optional retrieve-then-ask experiment |
| `fixtures/` | Small public sample corpus for ranking tests |
| `eval_questions.json` | Four questions, including one that should stay unanswered |

## Tests

```bash
cd bm25-notes-search
python3 -m unittest discover -s tests -v
```

15 tests cover tokenising, ranking, passage splits, missing folders, and a mocked local-model connection failure. They do not download a model.

## Not included (on purpose)

- Vector embeddings
- A web UI
- Index persistence (rebuilds on each run; fine for tens of notes)
- A claim that the local model improves answers until that is measured
