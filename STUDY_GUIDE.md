# Comprehensive Study Guide: AI-Powered Academic Research Portal
**Course:** UE23CS351A – Database Management Systems Mini Project (Level 3)  
**Institution:** Department of Computer Science & Engineering, PES University, Bengaluru  
**Team Members:**  
- **Adarsh Shivanand Madli** (SRN: PES2UG24CS028, GitHub: `@adarshm1705`)  
- **Aakarsh** (GitHub: `@aaakarshhh1`)  
**Faculty Guide:** Dr. Shilpa S, Assistant Professor  

---

## 1. Executive Summary & Problem Definition

### 1.1 The Core Problem
Conventional academic search portals (such as Google Scholar or IEEE Xplore) operate primarily on **lexical syntactic matching** (BM25 or text-token keywords). This architecture suffers from two critical flaws:
1. **Semantic Vocabulary Mismatch:** A researcher querying *"learned cardinality estimation in joins"* will miss papers titled *"Deep Reinforcement Learning for SQL Cost Optimization"*, despite identical technical scope.
2. **Disconnected Relational & Qualitative Information:** Citation topologies require strict referential integrity (ACID relational properties), whereas peer review evaluation rubrics and activity feeds are semi-structured, extensible, and document-oriented.

### 1.2 The Solution
Our portal utilizes a **Tri-Modal Database Architecture**:
- **Relational DBMS (PostgreSQL):** 16 normalized tables enforcing 3NF schema, primary/foreign keys, and cascade constraints.
- **Vector DBMS (pgvector):** 1536-dimensional embeddings with an IVFFlat index using cosine distance (`<=>`) to capture the semantic essence of paper abstracts.
- **NoSQL Document Store (JSONB):** Semi-structured multi-criteria peer-review rubrics and activity audit streams.
- **Database Automation (PL/pgSQL):** Event triggers for citation count maintenance and full-text updates, plus stored procedures for bibliometric H-Index calculations and personalized recommendations.

---

## 2. Multi-Modal Database Architecture

```
                               ┌────────────────────────────────────────────────────────┐
                               │             Next.js 14 Web Application                │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                    ┌─────────────────────────────────────┼─────────────────────────────────────┐
                    ▼                                     ▼                                     ▼
     ┌──────────────────────────────┐      ┌──────────────────────────────┐      ┌──────────────────────────────┐
     │      RELATIONAL (SQL)        │      │      VECTOR DB (pgvector)    │      │      NoSQL (JSONB)           │
     │  16 Tables in 3NF Schema     │      │   High-Dim Vector Index      │      │   Semi-Structured Documents  │
     ├──────────────────────────────┤      ├──────────────────────────────┤      ├──────────────────────────────┤
     │ • Users, Authors, Tracks     │      │ • 1536-D paper embeddings    │      │ • Multi-criteria peer-review │
     │ • Directed Citation Graph    │      │ • IVFFlat indexing           │      │   evaluation rubrics         │
     │ • Referential Integrity      │      │ • Cosine distance (<=>)      │      │ • Audit event activity feeds │
     │ • Cascade constraints        │      │ • Semantic paper discovery   │      │ • JSON queries (->, ->>)     │
     └──────────────────────────────┘      └──────────────────────────────┘      └──────────────────────────────┘
                    ▲                                     ▲                                     ▲
                    └─────────────────────────────────────┴─────────────────────────────────────┘
                                                          │
                                     ┌────────────────────┴────────────────────┐
                                     │   DATABASE AUTOMATION (PL/pgSQL)        │
                                     ├─────────────────────────────────────────┤
                                     │ • Trigger: trg_increment_citation_count │
                                     │ • Trigger: trg_update_paper_fulltext    │
                                     │ • Function: calculate_h_index()         │
                                     │ • Function: generate_recommendations()  │
                                     └─────────────────────────────────────────┘
```

---

## 3. Relational Schema & Table Definitions (16 Tables)

1. **`users`**: System identities with role constraints (`Researcher`, `Reviewer`, `Conference Chair`, `Admin`) and bcrypt hashed passwords.
2. **`institutions`**: Academic organizations (PES University, MIT, Stanford, IISc, CMU).
3. **`authors`**: Faculty and scholars linked to institutions via `institution_id` (`ON DELETE SET NULL`), containing ORCID identifiers.
4. **`conference_tracks`**: Academic conference tracks (e.g., VLDB 2026, SIGMOD 2026, NeurIPS 2026, ICDE 2026).
5. **`papers`**: Central literature entity with title, abstract, keywords, publication date, DOI, venue, citation counter, and `fulltext_tsv` tsvector column.
6. **`paper_authors`**: Junction table mapping papers to authors with `author_order` constraint (`author_order > 0`).
7. **`paper_embeddings`**: High-dimensional vector storage with `VECTOR(1536)` datatype and IVFFlat index.
8. **`reviewers`**: Reviewer credentials, expertise fields, and verification flags linked to `users`.
9. **`peer_reviews`**: Evaluations with ratings (1–10), recommendation text, and status (`pending`, `accepted`, `rejected`).
10. **`citations`**: Directed citation network (`citing_paper_id` $\to$ `cited_paper_id`) with check constraint `CHECK (citing_paper_id <> cited_paper_id)` preventing self-citations.
11. **`bookmarks`**: User paper saves with unique compound constraint `UNIQUE (user_id, paper_id)`.
12. **`reading_lists`**: Custom user reading collections.
13. **`list_items`**: Junction mapping reading lists to papers.
14. **`review_comments`**: NoSQL JSONB store containing multi-dimensional scoring rubrics (`novelty`, `methodology`, `reproducibility`) and qualitative text.
15. **`activity_feeds`**: Event-sourced audit log recording user actions in JSONB payloads.

---

## 4. Database Automation: Triggers & Stored Procedures

### 4.1 Automatic Citation Count Trigger (`trg_increment_citation_count`)
* **Purpose:** Ensures transactional consistency between the `citations` edge list and the `papers.citation_count` metric without requiring application-level manual incrementation.
* **SQL:**
```sql
CREATE OR REPLACE FUNCTION increment_citation_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE papers
    SET citation_count = citation_count + 1
    WHERE paper_id = NEW.cited_paper_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_citation_count
AFTER INSERT ON citations
FOR EACH ROW
EXECUTE FUNCTION increment_citation_count();
```

### 4.2 Dynamic H-Index Calculation Function (`calculate_h_index`)
* **Definition:** An author has H-Index $h$ if $h$ of their $N$ publications have at least $h$ citations each.
* **Implementation:** Uses window ranking (`ROW_NUMBER() OVER (ORDER BY citation_count DESC)`).
```sql
CREATE OR REPLACE FUNCTION calculate_h_index(p_author_id BIGINT)
RETURNS INTEGER AS $$
DECLARE h INTEGER := 0;
BEGIN
    SELECT COUNT(*) INTO h
    FROM (
        SELECT p.citation_count, ROW_NUMBER() OVER (ORDER BY p.citation_count DESC) AS rn
        FROM papers p
        JOIN paper_authors pa ON p.paper_id = pa.paper_id
        WHERE pa.author_id = p_author_id
    ) ranked
    WHERE citation_count >= rn;
    RETURN h;
END;
$$ LANGUAGE plpgsql;
```

### 4.3 Personalized Recommendation Function (`generate_recommendations`)
* **Formula:** Composite score combining citation authority (60%) and community popularity (40%):
  $$\text{Score} = 0.6 \times \text{citation\_count} + 0.4 \times \text{bookmarks\_count}$$
* **Exclusion:** Automatically filters out papers already bookmarked by `p_user_id`.

---

## 5. Lab Queries Breakdown (Sections 7.1 to 10)

| Section | Query Type | Purpose & Description |
| :--- | :--- | :--- |
| **7.1** | **GROUP BY & AGGREGATE** | Computes `COUNT(DISTINCT paper_id)`, `AVG(citation_count)`, and `AVG(rating)` grouped by conference track. |
| **7.2** | **UPDATE Operation** | Promotes pending papers with review rating $\ge 8$ to accepted status with oral presentation recommendation. |
| **7.3** | **DELETE Operation** | Safely deletes a specific user bookmark while verifying referential integrity constraints. |
| **7.4** | **Correlated Subquery** | Identifies papers whose citation count is strictly greater than the average citation count of papers in their *own* conference track. |
| **7.5** | **Nested Subquery** | Selects authors who published papers where none of their authored papers have ever been rejected. |
| **8.1** | **Stored Functions** | Executes `calculate_h_index(1)` and `generate_recommendations(2, 5)`. |
| **8.2** | **Triggers Verification** | Demonstrates `trg_increment_citation_count` by testing citation count before and after insert. |
| **9** | **Vector Cosine Search** | Computes cosine distance ($1 - \text{cosine\_distance}$) using pgvector `<=>` operator over 1536-D embeddings. |
| **10** | **NoSQL JSONB Query** | Queries nested rubric documents: `(comment_data->'rubric'->>'reproducibility')::INTEGER >= 9`. |

---

## 6. Viva Examination: Expected Questions & Confident Answers

**Q1: Why did you choose a multi-modal database over separate standalone databases?**  
> *"Standalone databases (e.g., PostgreSQL for SQL + Pinecone for Vector + MongoDB for NoSQL) create distributed synchronization bottlenecks, network overhead, and two-phase commit complexities. By using PostgreSQL with `pgvector` and `JSONB`, we achieve multi-model capabilities inside a single unified engine under one ACID transactional boundary."*

**Q2: What is the mathematical difference between Euclidean Distance and Cosine Distance in vector search?**  
> *"Euclidean distance measures the straight-line spatial distance between points, which is sensitive to text length. Cosine distance measures the angular orientation between two normalized vectors:  
> $$\text{Cosine Similarity} = \frac{A \cdot B}{\|A\|_2 \|B\|_2}$$  
> This ensures that short abstracts and long papers discussing the same concepts achieve high similarity regardless of document length."*

**Q3: How does your correlated subquery differ from a regular subquery?**  
> *"In a regular subquery, the inner query executes once and returns a static value. In a correlated subquery, the inner query references `p.track_id` from the outer query row-by-row, evaluating the track average dynamically for each specific conference track."*

**Q4: How did team members divide responsibilities on this project?**  
> *"Adarsh Shivanand Madli led the core database architecture, DDL/DML scripts, PL/pgSQL triggers, and pgvector cosine search integration. Aakarsh led the Next.js API route integration, NoSQL JSONB rubric schema, frontend dashboard, and query execution console. Both members contributed to Git commits and database testing."*
