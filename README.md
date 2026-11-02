# AI-Powered Academic Research Portal
**UE23CS351A – Database Management Systems Mini Project**  
**Department of Computer Science and Engineering, PES University, Bengaluru**

---

### Student & Guide Information
- **Student Name:** Adarsh Shivanand Madli
- **SRN:** PES2UG24CS028
- **Program:** B.Tech in Computer Science and Engineering (5th Semester)
- **Faculty Guide:** Dr. Shilpa S, Assistant Professor, PES University

---

## 1. Project Overview & Problem Definition
Traditional academic portals rely strictly on syntactic keyword matching (BM25 or text searches), losing the latent conceptual meaning of abstracts and the rich directed topology of citation networks.

The **AI-Powered Academic Research Portal** addresses these challenges through a unified multi-modal database architecture:
1. **Relational Database (PostgreSQL):** Enforces strict referential integrity, ACID transactional consistency, cascaded deletions, and 3NF relational schemas for users, institutions, authors, conference tracks, citations, bookmarks, and peer reviews.
2. **Vector Database (pgvector):** Generates and indexes 1536-dimensional abstract embeddings using IVFFlat cosine distance indexing (`<=>`), enabling semantic conceptual similarity search (*"find papers conceptually similar to X"*).
3. **NoSQL Document Store (JSONB):** Supports semi-structured, extensible peer-review evaluation rubrics (`review_comments`) and auditable event activity feeds (`activity_feeds`).
4. **Database Automation (PL/pgSQL):**
   - **Trigger `trg_update_paper_fulltext`:** Automatically updates `tsvector` column on title/abstract modification for GIN indexing.
   - **Trigger `trg_increment_citation_count` & `trg_decrement_citation_count`:** Automatically updates `citation_count` upon insertion or deletion into the `citations` table.
   - **Function `calculate_h_index(p_author_id)`:** Evaluates an author's bibliometric H-Index dynamically using window ranking.
   - **Function `generate_recommendations(p_user_id, p_limit)`:** Generates personalized research recommendations based on a composite citation and community bookmark ranking function.

---

## 2. Tech Stack
- **Database Engine:** PostgreSQL 16+ with `pgvector` extension & native `JSONB` support
- **Backend / API:** Next.js API Routes (Node.js runtime)
- **Frontend Framework:** Next.js 14, React 18, Tailwind CSS, Lucide React icons
- **Architecture:** Multi-Modal (Relational + Vector + Document Store)

---

## 3. Project Directory Tree Structure
```text
academic_research_portal/
├── sql/
│   ├── 01_schema.sql         # Complete DDL: 16 tables, GIN & IVFFlat indexes, triggers, functions
│   ├── 02_seed.sql           # Realistic academic seed dataset (PES Univ, MIT, authors, papers, citations)
│   └── 03_queries.sql        # All required report queries (7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 9, 10)
├── src/
│   ├── components/
│   │   ├── Navbar.js         # Header with PES branding, user profile & navigation
│   │   └── Footer.js         # Footer with course UE23CS351A and author metadata
│   ├── lib/
│   │   └── db.js             # In-app relational & vector store, cosine math, triggers, query runner
│   ├── pages/
│   │   ├── api/
│   │   │   ├── activity.js           # Audit event stream endpoint (JSONB)
│   │   │   ├── authors/index.js      # Authors directory & H-Index computation
│   │   │   ├── papers/
│   │   │   │   ├── index.js          # Papers list with full-text & vector search
│   │   │   │   └── [id].js           # Single paper details & citation graph
│   │   │   │   └── [id]/bookmark.js  # User bookmark toggle
│   │   │   │   └── [id]/cite.js      # Citation insert/delete (trigger verification)
│   │   │   ├── queries/run.js        # SQL query execution engine (7.1 to 10)
│   │   │   ├── recommendations.js    # Stored function personalized recommendations
│   │   │   └── reviews/index.js      # Peer review submission & JSONB rubrics
│   │   ├── _app.js           # Next.js App component
│   │   ├── index.js          # Main Dashboard & overview metrics
│   │   ├── papers/
│   │   │   ├── index.js      # Explore papers with Full-Text vs Vector toggle
│   │   │   └── [id].js       # Paper details, citations, similar vector neighbors
│   │   ├── authors.js        # Authors directory & computed H-Index
│   │   ├── reviews.js        # Peer review portal & JSONB rubric evaluation
│   │   ├── recommendations.js# AI Personalized Recommender
│   │   └── dbms-lab.js       # Interactive DBMS SQL Lab Console (Sections 7.1 to 10)
│   └── styles/
│       └── globals.css       # Tailwind CSS & custom PES styling
├── next.config.js            # Next.js configuration
├── package.json              # Project scripts & dependencies
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS styling tokens
└── README.md                 # Documentation & execution guide
```

---

## 4. How to Run the Project

### Prerequisites
- Node.js (v18.x or v20.x or v24.x)
- npm (v9+ or v11+)

### Step 1: Open Terminal in the Project Directory
```powershell
cd "C:\Users\adaap\.gemini\antigravity\scratch\academic_research_portal"
```

### Step 2: Start the Next.js Development Server
```powershell
npm run dev
```

### Step 3: Open in Browser
Visit **`http://localhost:3000`** in your browser.

---

## 5. Live Demonstration & Verification Walkthrough

1. **Dashboard (`/`):**
   - View overview metrics: 6 Research Papers, 166 Citations, 7 Faculty Authors, 4 Tracks, 1536-D Vector Index.
   - Live natural language semantic search bar.
   - Live JSONB Audit Activity Feed.

2. **Explore Papers & Semantic Search (`/papers`):**
   - Toggle between **Vector (pgvector)** and **Full-Text (GIN)** search.
   - Filter by conference tracks (VLDB, SIGMOD, NeurIPS, ICDE).
   - Bookmark papers and observe the live bookmark count change.

3. **Paper Graph & Citation Details (`/papers/1`):**
   - View full metadata, DOI, author affiliations (PES University).
   - **Vector Similarity Search:** Inspect conceptually similar papers ranked by cosine similarity.
   - **Directed Citation Network:** View inbound and outbound references.
   - **Trigger Verification:** Click *"Fire Citation Trigger"* to add a citation and verify automatic `citation_count` increment.

4. **Authors & H-Index (`/authors`):**
   - View faculty authors with computed H-Index.
   - Expand author cards to inspect their published papers and individual citations.

5. **Peer Reviews & NoSQL Rubrics (`/reviews`):**
   - Review papers with rating 1-10 and recommendation.
   - View and submit multi-dimensional JSONB evaluation rubrics (Novelty, Methodology, Reproducibility).

6. **Interactive DBMS SQL Console (`/dbms-lab`):**
   - **Section 7.1:** Simple Query with GROUP BY & AGGREGATE
   - **Section 7.2:** UPDATE Operation
   - **Section 7.3:** DELETE Operation
   - **Section 7.4:** Correlated Subquery (citation count > track average)
   - **Section 7.5:** Nested Subquery (authors with 0 rejected papers)
   - **Section 8.1:** Stored Procedures & Functions (`calculate_h_index`, `generate_recommendations`)
   - **Section 8.2:** Triggers Verification (`trg_increment_citation_count`)
   - **Section 9:** Vector Cosine Similarity Search (`<=>` operator)
   - **Section 10:** NoSQL JSONB Querying (Rubric scores & Activity Feed)
   - Click **"Run Query"** on each section to view the exact SQL, EXPLAIN plan, execution time in ms, and formatted tabular results! Perfect for taking report screenshots.

---

## 6. PostgreSQL Terminal Commands (Optional Native DB Run)
If you wish to execute the raw SQL scripts directly against a local PostgreSQL instance:
```powershell
# 1. Login to PostgreSQL
psql -U postgres

# 2. Create and switch to the database
CREATE DATABASE academic_research_portal;
\c academic_research_portal

# 3. Execute Schema DDL
\i sql/01_schema.sql

# 4. Execute Seed Data
\i sql/02_seed.sql

# 5. Run Report Queries
\i sql/03_queries.sql
```

