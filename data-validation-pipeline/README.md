# Data Validation Pipeline (archived demo)

**Not linked from the public portfolio.** Generic ETL validation demo kept for reference only.

Problem: Partner org data imports need reliable validation before bad rows propagate downstream.

What this sketches: Python/SQL pipeline with validation rules, anomaly checks, and monitoring hooks.

Status: Demo / reference implementation

## Features

- Automated validation rules and duplicate detection
- Batch and streaming processing patterns
- PostgreSQL-oriented schema examples
- Monitoring hooks for pipeline runs

## Tech Stack

- Python 3.10+
- SQL (PostgreSQL)
- Pandas / NumPy
- Docker Compose (optional local stack)

## Getting Started

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python src/main.py
```
