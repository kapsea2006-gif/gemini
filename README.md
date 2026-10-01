# NexusCollab — Academia–Industry Collaboration Portal

A production-ready full-stack web application designed to connect university researchers, students, and academic departments with industry sponsors, technology companies, and research labs.

The system features an **Explainable AI Skill Compatibility Matching Engine**, role-based portals for **Students**, **Companies**, and **Academic Administrators**, and real-time skill demand-supply analytics.

---

## 🌟 Key Features

### 🎓 1. Student Portal
- **Academic & Skills Profile**: Maintain major, university, GPA, graduation year, verified technical skills, industry certifications, and research interests.
- **Adaptive AI Internship Recommendations**: Live ranking of available internships based on compatibility scores (0–100%).
- **Interactive Match Breakdown**: Transparent inspection of why an internship matches:
  - Required skills overlap (55% weight)
  - Preferred skills bonus (15% weight)
  - Academic & major compatibility (15% weight)
  - Domain research interests synergy (15% weight)
  - Industry certifications bonus boost (+10%)
- **AI Skill-Bridge Guidance**: Actionable recommendations on coursework or tools needed to bridge qualification gaps.
- **One-Click Application Tracking**: Monitor status pipeline (`applied`, `under_review`, `shortlisted`, `interviewing`, `accepted`, `rejected`).

### 🏢 2. Company Portal
- **Institution & Company Identity**: Manage company profile, industry classification, website, and verification credentials.
- **Internship Publisher**: Post internships with required skills, preferred skills, location type (Remote, Hybrid, On-site), duration, monthly stipend, and target academic fields.
- **AI Candidate Review Center**: Review incoming applicants automatically ranked in descending order by their AI skill compatibility score, examine matched vs missing skills, and update application decisions.

### 🛡️ 3. Academic Administrator Portal
- **Executive Analytics Dashboard**: Real-time counts of students, companies, active postings, applications, and platform-wide average match scores.
- **Industry vs Academic Skill Gap Matrix**: Visual dual-bar comparison comparing the technical skills most demanded by employers against the skills possessed by students.
- **Institutional Verification Center**: One-click verification and vetting of partner employers.
- **User Account Management**: Search, filter by role, and activate/suspend user accounts.
- **AI Matching Engine Settings**: View and inspect registered matching algorithms and weighting parameters.

---

## 🧠 Extensible AI Matching Engine Architecture

The AI matching module is structured using the **Adapter and Factory design patterns** (`app/matching/`), allowing it to be easily swapped, improved, or benchmarked against other algorithms without altering the core business logic.

```
backend/app/matching/
├── __init__.py
├── base.py              # BaseMatchingEngine (Abstract Interface) & MatchScoreResult
├── rule_engine.py       # WeightedRulesMatchingEngine (Production canonical rule engine)
├── semantic_engine.py   # SemanticCosineMatchingEngine (Vector space TF-IDF cosine similarity)
└── factory.py           # get_matching_engine() & register_matching_engine()
```

### Swapping or Adding a New Engine (e.g. LLM / Embeddings)
To add a new matching engine (e.g., using HuggingFace SentenceTransformers, OpenAI embeddings, or Gemini):

```python
from app.matching.base import BaseMatchingEngine, MatchScoreResult
from app.matching.factory import register_matching_engine

class TransformerEmbeddingsEngine(BaseMatchingEngine):
    @property
    def engine_name(self) -> str:
        return "TransformerEmbeddingsEngine-v1.0"

    def calculate_match(self, student_profile, internship) -> MatchScoreResult:
        # 1. Compute cosine similarity between student vector and internship vector
        # 2. Extract matched and missing skills
        return MatchScoreResult(...)

# Register at runtime:
register_matching_engine("transformer", TransformerEmbeddingsEngine)
```

Configure the active engine via `MATCHING_ENGINE=transformer` in `.env`.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide React Icons
- **Backend**: FastAPI (Python 3.12), SQLAlchemy 2.0 ORM, Pydantic v2, PyJWT, Passlib (PBKDF2 SHA-256)
- **Database**: PostgreSQL (with automatic zero-config SQLite fallback for local developer machines)

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database seed (Initializes tables & realistic sample data)
python app/seed.py

# Start the FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The API and interactive Swagger documentation will be available at:
- API Root: `http://localhost:8000`
- Interactive API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
The frontend portal will be live at `http://localhost:3000`.

### 3. PostgreSQL with Docker (Optional)

To run a PostgreSQL container:
```bash
docker-compose up -d
```
Then set in `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/academia_portal
```

---

## 🔑 Pre-Seeded Demo Accounts (One-Click Switcher Available)

For quick evaluation, the application provides an **interactive top demo banner** allowing 1-click role switching between Student, Company, and Admin:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student** | Alex Rivera (AI & CS Honors) | `alex.rivera@university.edu` | `StudentPass123!` |
| **Student** | Sarah Chen (Full-Stack & Cloud) | `sarah.chen@university.edu` | `StudentPass123!` |
| **Student** | Marcus Johnson (Data Science) | `marcus.j@university.edu` | `StudentPass123!` |
| **Student** | Priya Patel (Cybersecurity) | `priya.patel@university.edu` | `StudentPass123!` |
| **Company** | NovaTech AI Labs | `contact@novatech.ai` | `CompanyPass123!` |
| **Company** | FinEdge Analytics | `recruiter@finedge.com` | `CompanyPass123!` |
| **Company** | GreenPulse CleanTech | `careers@greenpulse.org` | `CompanyPass123!` |
| **Admin** | Dr. Eleanor Vance (Dean) | `admin@academia-portal.edu` | `AdminPass123!` |
