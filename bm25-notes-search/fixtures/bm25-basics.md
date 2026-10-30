# How this BM25 ranker works

This note describes the Python ranker in `bm25-notes-search/bm25.py`.
It is not a product write-up. It is a sample note so retrieval has more
than one file to score.

## Tokens

Text is lowercased. Tokens are `[a-z0-9]+` runs. There is no stemming.
`tokeniz` does not match `tokenize`.

## Score

For each query term that appears in a note, the score adds inverse
document frequency times a saturated term-frequency term. A word that
is rare across the folder but common in one note helps that note rise.
Repeating the word helps less and less.

Defaults in `BM25Index` are `k1 = 1.5` and `b = 0.75`. A long note is
slightly down-weighted. A long note does not automatically win.

## What this file is for

Use it to test whether keyword search can find an explanation of ranking
without embeddings.
