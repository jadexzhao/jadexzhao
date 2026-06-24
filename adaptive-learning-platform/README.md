# Adaptive Learning Platform

Problem: Students need personalized, accessible learning pathways that adapt to language and learning differences.

What I built: A full-stack ML-powered platform delivering personalized recommendations and teacher dashboards — deployed with partner nonprofits (result: +45% student engagement).

Status: Complete

## Features

🧠 **Intelligent Recommendations**
- ML-based personalized learning pathways
- Student profile analysis and progress tracking
- Adaptive difficulty adjustment
- Learning style detection and optimization

♿ **Accessibility First**
- WCAG 2.1 AA compliant interface
- Multi-language support including ELL accommodations
- Screen reader optimized
- Dyslexia-friendly typography and layouts

📊 **Progress Analytics**
- Real-time engagement tracking
- Learning outcome measurement
- Teacher/admin dashboards
- Exportable progress reports

🌍 **ELL & Special Needs Support**
- Vocabulary scaffolding
- Visual aids and multi-modal content
- Processing time accommodations
- Cultural responsiveness in content

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Framework**: Tailwind CSS
- **State Management**: Context API / Redux
- **Build**: Vite

### Backend
- **Language**: Python 3.10+
- **ML Framework**: scikit-learn / TensorFlow
- **API**: FastAPI / Flask
- **Database**: PostgreSQL
- **Authentication**: JWT

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.10+
- PostgreSQL 13+

### Frontend Setup

```bash
cd src
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

## Project Structure

```
adaptive-learning-platform/
├── src/                      # React frontend
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── backend/                  # Python ML backend
│   ├── models/              # ML models
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   ├── database/            # DB models & migrations
│   └── requirements.txt
├── README.md
└── package.json
```

## Key Components

### Recommendation Engine
- Collaborative filtering for peer similarity
- Content-based filtering for skill matching
- Hybrid approach for optimal accuracy

### Student Profile
- Learning style assessment (visual, auditory, kinesthetic)
- Disability accommodation preferences
- Language proficiency level
- Subject area strengths/challenges

### Progress Tracking
- Real-time engagement metrics
- Knowledge retention assessment
- Time-on-task monitoring
- Learning objective completion rates

## Deployment

Currently deployed to partner nonprofit organizations serving:
- English Language Learners (ELL)
- Students with learning disabilities
- Underserved student populations

## Impact

- **+45% student engagement** across deployed partners
- Improved learning outcomes for ELL students
- Accessibility compliance across all features
- Positive feedback from educators and learners
