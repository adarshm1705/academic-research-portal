import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

doc = Document()

# Set standard margins (1 inch)
for section in doc.sections:
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

# Styles helper
def add_title(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(24)
    run.font.bold = True
    run.font.color.rgb = RGBColor(11, 43, 100) # PES Blue
    return p

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = RGBColor(11, 43, 100)
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = RGBColor(30, 64, 175)
    return p

def add_body(text, bold_prefix=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(11)
    return p

def add_code(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(30, 41, 59)
    return p

# -------------------------------------------------------------
# COVER PAGE
# -------------------------------------------------------------
p_uni = doc.add_paragraph()
p_uni.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_uni = p_uni.add_run("PES UNIVERSITY\n")
r_uni.font.name = 'Calibri'
r_uni.font.size = Pt(20)
r_uni.font.bold = True
r_uni.font.color.rgb = RGBColor(11, 43, 100)

r_sub = p_uni.add_run("(Established under Karnataka Act No. 16 of 2013)\nElectronic City, Hosur Road, Bengaluru – 560 100, Karnataka, India\n\n")
r_sub.font.name = 'Calibri'
r_sub.font.size = Pt(10)
r_sub.font.color.rgb = RGBColor(100, 116, 139)

p_rep = doc.add_paragraph()
p_rep.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_rep = p_rep.add_run("Mini Project Report on\n\n")
r_rep.font.name = 'Calibri'
r_rep.font.size = Pt(14)
r_rep.font.color.rgb = RGBColor(71, 85, 105)

p_tit = doc.add_paragraph()
p_tit.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_tit = p_tit.add_run("AI-POWERED ACADEMIC RESEARCH PORTAL\n\n")
r_tit.font.name = 'Calibri'
r_tit.font.size = Pt(22)
r_tit.font.bold = True
r_tit.font.color.rgb = RGBColor(11, 43, 100)

p_ful = doc.add_paragraph()
p_ful.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_ful = p_ful.add_run("Submitted in partial fulfilment of the requirements for the award of degree of\nBachelor of Technology\nin\nComputer Science & Engineering\nUE23CS351A – DBMS Project\n\n")
r_ful.font.name = 'Calibri'
r_ful.font.size = Pt(12)
r_ful.font.italic = True

p_by = doc.add_paragraph()
p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_by.add_run("Submitted by:\n").font.bold = True

tbl_stu = doc.add_table(rows=2, cols=2)
tbl_stu.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_stu.cell(0, 0).paragraphs[0].add_run("Adarsh Shivanand Madli").font.bold = True
tbl_stu.cell(0, 1).paragraphs[0].add_run("PES2UG24CS028").font.bold = True
tbl_stu.cell(1, 0).paragraphs[0].add_run("Aakarsh").font.bold = True
tbl_stu.cell(1, 1).paragraphs[0].add_run("PES2UG24CS040").font.bold = True

p_gui = doc.add_paragraph()
p_gui.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_gui.paragraph_format.space_before = Pt(18)
r_gui = p_gui.add_run("under the guidance of\n")
r_gui.font.italic = True
r_dr = p_gui.add_run("Dr. Shilpa S\n")
r_dr.font.bold = True
r_dr.font.size = Pt(13)
p_gui.add_run("Assistant Professor\nDepartment of Computer Science and Engineering\nPES University\n\nAUG - DEC 2026")

doc.add_page_break()

# -------------------------------------------------------------
# CERTIFICATE
# -------------------------------------------------------------
add_title("CERTIFICATE")
add_body("This is to certify that the mini project entitled \"AI-Powered Academic Research Portal\" is a bonafide work carried out by Adarsh Shivanand Madli (PES2UG24CS028) and Aakarsh (PES2UG24CS040) in partial fulfilment for the completion of fifth semester DBMS Project (UE23CS351A) in the Program of Study – Bachelor of Technology in Computer Science and Engineering under rules and regulations of PES University, Bengaluru during the period AUG 2026 – DEC 2026.")
add_body("It is certified that all corrections / suggestions indicated for internal assessment have been incorporated in the report. The project has been approved as it satisfies the 5th semester academic requirements in respect of project work.")

p_sig = doc.add_paragraph()
p_sig.paragraph_format.space_before = Pt(40)
r_sig1 = p_sig.add_run("Dr. Shilpa S\nAssistant Professor\nFaculty Guide\nDepartment of CSE, PES University\n\n\n")
r_sig1.font.bold = True
r_sig2 = p_sig.add_run("Dr. Sandesh B J\nProfessor & Chairperson\nDepartment of CSE, PES University")
r_sig2.font.bold = True

doc.add_page_break()

# -------------------------------------------------------------
# DECLARATION & ACKNOWLEDGEMENT
# -------------------------------------------------------------
add_title("DECLARATION")
add_body("We hereby declare that the DBMS Project entitled \"AI-Powered Academic Research Portal\" has been carried out by us under the guidance of Dr. Shilpa S, Assistant Professor, Department of Computer Science and Engineering, PES University, and submitted in partial fulfilment of the course requirements for the award of degree of Bachelor of Technology in Computer Science and Engineering of PES University, Bengaluru during the academic semester AUG – DEC 2026.")
add_body("We further declare that the content of this project report has not been submitted previously for the award of any degree or diploma to any other university or institution.")

p_dec = doc.add_paragraph()
p_dec.paragraph_format.space_before = Pt(24)
p_dec.add_run("Adarsh Shivanand Madli (PES2UG24CS028)\nAakarsh (PES2UG24CS040)\nDepartment of Computer Science & Engineering, PES University").font.bold = True

doc.add_paragraph().paragraph_format.space_before = Pt(20)

add_title("ACKNOWLEDGEMENT")
add_body("We would like to express our deepest gratitude to Dr. Shilpa S, Assistant Professor, Department of Computer Science and Engineering, PES University, for her continuous guidance, invaluable mentorship, and encouragement throughout the design and implementation of this UE23CS351A – DBMS Project.")
add_body("We take this opportunity to thank Dr. Sandesh B J, Professor and Chairperson, Department of Computer Science and Engineering, PES University, for providing the necessary facilities, academic atmosphere, and support throughout our semester.")
add_body("We are profoundly grateful to Prof. Jawahar Doreswamy, Chancellor, and Dr. Suryaprasad J, Vice-Chancellor, PES University, for fostering a university culture of hands-on experiential learning.")
add_body("Finally, we express our heartfelt thanks to our parents, family members, and fellow students for their constant moral support and enthusiasm throughout this work.")

doc.add_page_break()

# -------------------------------------------------------------
# ABSTRACT & TOC
# -------------------------------------------------------------
add_title("ABSTRACT")
add_body("Traditional scientific literature repositories and academic discovery systems (such as IEEE Xplore, Google Scholar, and ACM Digital Library) rely primarily on exact lexical syntactic matching (e.g., BM25 and tokenized keyword searches). This approach exhibits fundamental limitations: (1) vocabulary mismatch where papers investigating identical conceptual topics using alternate nomenclature are lost, (2) citation graph topological disconnect where relational bibliographic links are treated as passive text metadata rather than queryable directed graphs, and (3) peer-review rubric rigidity where qualitative assessment dimensions are forced into either restrictive relational columns or unindexed text blobs.")
add_body("To address these challenges, this project presents an AI-Powered Academic Research Portal architected on a tri-hybrid database foundation: (i) PostgreSQL for relational ACID consistency and 3NF schema enforcement across 16 tables, (ii) pgvector for 1536-dimensional abstract embeddings with IVFFlat cosine distance indexing (<=>) enabling semantic discovery, and (iii) NoSQL JSONB document storage for multi-dimensional peer-review evaluation rubrics and auditable event activity streams. Database-level automation is achieved through PL/pgSQL event triggers for real-time citation synchronization and full-text tsvector updating, coupled with stored functions for dynamic author H-Index evaluation and personalized research paper recommendations. The application interface is built using Next.js 14 and React, featuring an interactive DBMS SQL Lab console for real-time query verification.")

add_heading_1("TABLE OF CONTENTS")
toc_items = [
    ("1", "INTRODUCTION", "1"),
    ("2", "PROBLEM DEFINITION", "2"),
    ("3", "ER MODEL", "3"),
    ("4", "ER TO RELATIONAL MAPPING", "5"),
    ("  4.1", "Steps of Algorithm for Chosen Problem", "5"),
    ("  4.2", "Complete Diagram of Relational Mapping", "6"),
    ("5", "DDL STATEMENTS", "7"),
    ("6", "DML STATEMENTS", "11"),
    ("7", "QUERIES", "14"),
    ("  7.1", "Simple Query with GROUP BY and AGGREGATE", "14"),
    ("  7.2", "UPDATE Operation", "15"),
    ("  7.3", "DELETE Operation", "16"),
    ("  7.4", "Correlated Subquery", "17"),
    ("  7.5", "Nested Subquery", "18"),
    ("8", "STORED PROCEDURES, FUNCTIONS AND TRIGGERS", "19"),
    ("  8.1", "Stored Procedures and Functions", "19"),
    ("  8.2", "Triggers Verification", "21"),
    ("9", "VECTOR DATABASE & NOSQL IMPLEMENTATION", "22"),
    ("  9.1", "pgvector 1536-D Semantic Cosine Distance Search", "22"),
    ("  9.2", "NoSQL JSONB Document Rubrics and Activity Feeds", "23"),
    ("10", "FRONT END DEVELOPMENT (NEXT.JS 14)", "24"),
    ("REFERENCES", "REFERENCES / BIBLIOGRAPHY", "27"),
    ("APPENDIX", "APPENDIX A: DEFINITIONS, ACRONYMS AND ABBREVIATIONS", "28")
]

tbl_toc = doc.add_table(rows=len(toc_items)+1, cols=3)
tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_toc.cell(0, 0).paragraphs[0].add_run("Chapter No.").font.bold = True
tbl_toc.cell(0, 1).paragraphs[0].add_run("Title").font.bold = True
tbl_toc.cell(0, 2).paragraphs[0].add_run("Page").font.bold = True
for idx, item in enumerate(toc_items):
    tbl_toc.cell(idx+1, 0).paragraphs[0].add_run(item[0])
    tbl_toc.cell(idx+1, 1).paragraphs[0].add_run(item[1])
    tbl_toc.cell(idx+1, 2).paragraphs[0].add_run(item[2])

doc.add_page_break()

# -------------------------------------------------------------
# CHAPTER 1: INTRODUCTION
# -------------------------------------------------------------
add_heading_1("1. INTRODUCTION")
add_body("Database management systems form the operational backbone of modern scientific literature dissemination. Over the last decade, academic publishing has expanded exponentially, with more than 3 million peer-reviewed articles published annually. As research becomes increasingly interdisciplinary, conventional keyword indexing mechanisms fail to uncover relevant cross-domain literature.")
add_body("Modern database engineering demands a shift from monolithic relational architectures to multi-modal data processing. While relational tables excel at enforcing ACID transactional guarantees and complex referential integrity, emerging applications necessitate native support for high-dimensional vector embeddings generated by machine learning models, as well as flexible document structures for qualitative semi-structured feedback.")
add_body("This project, developed for the Level 3 Experiential Learning component of UE23CS351A at PES University, implements an end-to-end AI-Powered Academic Research Portal. The portal integrates PostgreSQL 16+, pgvector vector database extensions, and JSONB document paradigms into an interactive Next.js 14 web application.")

# -------------------------------------------------------------
# CHAPTER 2: PROBLEM DEFINITION
# -------------------------------------------------------------
add_heading_1("2. PROBLEM DEFINITION")
add_body("Academic research discovery systems frequently suffer from three primary structural challenges:", bold_prefix="Problem Statement: ")
add_body("1. Lexical Keyword Brittleness: Exact syntactic matching ignores synonymy and semantic proximity. If a researcher searches for 'approximate nearest neighbor search in database systems', traditional BM25 searches fail to rank papers discussing 'vector index synthesis in relational DBMS' unless explicit keyword overlap exists.")
add_body("2. Disconnected Citation Topology: Citation counts are frequently treated as static integers rather than dynamic directed graphs, creating data inconsistencies between citation event occurrences and literature impact metrics.")
add_body("3. Peer-Review Schema Rigidity: Scientific conferences utilize multi-criteria evaluation rubrics (novelty, methodology, reproducibility) that evolve across venues. Relational schemas struggle to accommodate evolving rubric attributes without frequent schema migrations.")

# -------------------------------------------------------------
# CHAPTER 3: ER MODEL
# -------------------------------------------------------------
add_heading_1("3. ER MODEL")
add_body("The conceptual schema for the AI-Powered Academic Research Portal models key entities and their complex relationships:")
add_body("• USERS: Identifies system participants with attributes user_id (PK), name, email, password_hash, role, and created_at.")
add_body("• INSTITUTIONS: Educational and research entities with institution_id (PK), name, country, and website.")
add_body("• AUTHORS: Researchers and faculty with author_id (PK), name, orcid, email, and institution_id (FK).")
add_body("• CONFERENCE_TRACKS: Scientific tracks with track_id (PK), track_name, description, conference_name, and year.")
add_body("• PAPERS: Core entity with paper_id (PK), title, abstract, keywords, publication_date, venue, doi, submitted_by (FK), track_id (FK), citation_count, and fulltext_tsv.")
add_body("• PAPER_AUTHORS: Associative entity resolving N:M relationship between PAPERS and AUTHORS with author_order.")
add_body("• PAPER_EMBEDDINGS: High-dimensional 1:1 entity containing 1536-D vector embeddings, model_name, and timestamp.")
add_body("• REVIEWERS: 1:1 specialization of USERS containing reviewer_id (PK), user_id (FK), expertise, and verified flag.")
add_body("• PEER_REVIEWS: N:M evaluation relationship between PAPERS and REVIEWERS with rating, recommendation, and status.")
add_body("• CITATIONS: Recursive/reflexive directed N:M relationship between citing papers and cited papers.")
add_body("• BOOKMARKS: N:M relationship between USERS and PAPERS with created_at timestamp.")
add_body("• READING_LISTS & LIST_ITEMS: Collections created by users containing multiple papers.")
add_body("• REVIEW_COMMENTS: Semi-structured JSONB document store containing multi-attribute rubrics.")
add_body("• ACTIVITY_FEEDS: Audit log tracking user actions in JSONB payloads.")

# -------------------------------------------------------------
# CHAPTER 4: ER TO RELATIONAL MAPPING
# -------------------------------------------------------------
add_heading_1("4. ER TO RELATIONAL MAPPING")
add_heading_2("4.1 Steps of Algorithm for Chosen Problem")
add_body("Step 1 (Regular Entities): Map strong entities USERS, INSTITUTIONS, CONFERENCE_TRACKS, and PAPERS into relational tables with surrogate BIGSERIAL primary keys.")
add_body("Step 2 (1:N Binary Relationships): Include primary key of parent table as foreign key in child table (e.g., institution_id in AUTHORS, track_id in PAPERS, submitted_by in PAPERS).")
add_body("Step 3 (M:N Binary Relationships): Create separate cross-reference tables (PAPER_AUTHORS with PK(paper_id, author_id), CITATIONS with PK(citation_id) and UNIQUE(citing_paper_id, cited_paper_id), BOOKMARKS with PK(bookmark_id) and UNIQUE(user_id, paper_id)).")
add_body("Step 4 (1:1 Specialization): Map REVIEWERS and PAPER_EMBEDDINGS referencing parent primary keys with UNIQUE constraints and CASCADE delete semantics.")
add_body("Step 5 (Multi-Valued / Semi-Structured): Map REVIEW_COMMENTS and ACTIVITY_FEEDS with JSONB document columns for schema-free qualitative storage.")

add_heading_2("4.2 Relational Schema Representation")
add_code("""USERS (user_id [PK], name, email [UQ], password_hash, role, created_at)
INSTITUTIONS (institution_id [PK], name, country, website)
AUTHORS (author_id [PK], name, orcid [UQ], email, institution_id [FK -> INSTITUTIONS])
CONFERENCE_TRACKS (track_id [PK], track_name, description, conference_name, year)
PAPERS (paper_id [PK], title, abstract, keywords, publication_date, venue, doi [UQ],
        submitted_by [FK -> USERS], track_id [FK -> CONFERENCE_TRACKS],
        citation_count, fulltext_tsv, created_at)
PAPER_AUTHORS (paper_id [PK, FK -> PAPERS], author_id [PK, FK -> AUTHORS], author_order)
PAPER_EMBEDDINGS (paper_id [PK, FK -> PAPERS], embedding [VECTOR(1536)], model_name, created_at)
REVIEWERS (reviewer_id [PK], user_id [FK -> USERS, UQ], expertise, verified)
PEER_REVIEWS (review_id [PK], paper_id [FK -> PAPERS], reviewer_id [FK -> REVIEWERS],
              rating, recommendation, review_date, status, UQ(paper_id, reviewer_id))
CITATIONS (citation_id [PK], citing_paper_id [FK -> PAPERS], cited_paper_id [FK -> PAPERS],
           created_at, UQ(citing_paper_id, cited_paper_id))
BOOKMARKS (bookmark_id [PK], user_id [FK -> USERS], paper_id [FK -> PAPERS], created_at, UQ(user_id, paper_id))
READING_LISTS (list_id [PK], user_id [FK -> USERS], name, created_at)
LIST_ITEMS (list_item_id [PK], list_id [FK -> READING_LISTS], paper_id [FK -> PAPERS], added_at, UQ(list_id, paper_id))
REVIEW_COMMENTS (comment_id [PK], review_id [FK -> PEER_REVIEWS], comment_data [JSONB], created_at)
ACTIVITY_FEEDS (activity_id [PK], user_id [FK -> USERS], activity_type, ref_id, details [JSONB], created_at)""")

# -------------------------------------------------------------
# CHAPTER 5: DDL STATEMENTS
# -------------------------------------------------------------
add_heading_1("5. DDL STATEMENTS")
add_body("The Data Definition Language (DDL) statements execute the relational schema in PostgreSQL, incorporating pgvector extension, domain constraints, foreign keys with ON DELETE CASCADE, GIN indexes, and IVFFlat vector indexes.")

add_code("""CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('Researcher', 'Reviewer', 'Admin', 'Conference Chair')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE institutions (
    institution_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    country VARCHAR(100),
    website VARCHAR(255)
);

CREATE TABLE authors (
    author_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    orcid VARCHAR(50) UNIQUE,
    email VARCHAR(150),
    institution_id BIGINT REFERENCES institutions(institution_id) ON DELETE SET NULL
);

CREATE TABLE conference_tracks (
    track_id BIGSERIAL PRIMARY KEY,
    track_name VARCHAR(150) NOT NULL,
    description TEXT,
    conference_name VARCHAR(200) NOT NULL,
    year INTEGER CHECK (year >= 1900)
);

CREATE TABLE papers (
    paper_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract TEXT NOT NULL,
    keywords TEXT,
    publication_date DATE,
    venue VARCHAR(200),
    doi VARCHAR(150) UNIQUE,
    submitted_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    track_id BIGINT REFERENCES conference_tracks(track_id) ON DELETE SET NULL,
    citation_count INTEGER NOT NULL DEFAULT 0 CHECK (citation_count >= 0),
    fulltext_tsv tsvector,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE paper_authors (
    paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES authors(author_id) ON DELETE CASCADE,
    author_order INTEGER NOT NULL CHECK (author_order > 0),
    PRIMARY KEY (paper_id, author_id),
    UNIQUE (paper_id, author_order)
);

CREATE TABLE paper_embeddings (
    paper_id BIGINT PRIMARY KEY REFERENCES papers(paper_id) ON DELETE CASCADE,
    embedding VECTOR(1536),
    model_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviewers (
    reviewer_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    expertise TEXT,
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE peer_reviews (
    review_id BIGSERIAL PRIMARY KEY,
    paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    reviewer_id BIGINT NOT NULL REFERENCES reviewers(reviewer_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    recommendation TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    UNIQUE (paper_id, reviewer_id)
);

CREATE TABLE citations (
    citation_id BIGSERIAL PRIMARY KEY,
    citing_paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    cited_paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (citing_paper_id <> cited_paper_id),
    UNIQUE (citing_paper_id, cited_paper_id)
);

CREATE TABLE bookmarks (
    bookmark_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, paper_id)
);

CREATE TABLE review_comments (
    comment_id BIGSERIAL PRIMARY KEY,
    review_id BIGINT NOT NULL REFERENCES peer_reviews(review_id) ON DELETE CASCADE,
    comment_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_feeds (
    activity_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    ref_id BIGINT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optimized Indexing
CREATE INDEX idx_papers_submitted_by ON papers(submitted_by);
CREATE INDEX idx_papers_track ON papers(track_id);
CREATE INDEX idx_paper_authors_author ON paper_authors(author_id);
CREATE INDEX idx_peer_reviews_paper ON peer_reviews(paper_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_citations_cited_paper ON citations(cited_paper_id);
CREATE INDEX idx_papers_fulltext ON papers USING GIN (fulltext_tsv);
CREATE INDEX idx_paper_embeddings_vector ON paper_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);""")

# -------------------------------------------------------------
# CHAPTER 6: DML STATEMENTS
# -------------------------------------------------------------
add_heading_1("6. DML STATEMENTS")
add_body("Realistic seed data was inserted to establish realistic academic benchmarks spanning PES University, MIT, Stanford, and Carnegie Mellon University.")
add_code("""INSERT INTO users (user_id, name, email, password_hash, role) VALUES
(1, 'Dr. Shilpa S', 'shilpa.s@pes.edu', '$2b$12$eX9vU2M3y8FhO.01', 'Conference Chair'),
(2, 'Adarsh Shivanand Madli', 'adarsh.madli@pes.edu', '$2b$12$eX9vU2M3y8FhO.02', 'Researcher'),
(3, 'Prof. Sandesh B J', 'sandesh.bj@pes.edu', '$2b$12$eX9vU2M3y8FhO.03', 'Reviewer'),
(4, 'Dr. Michael Stonebraker', 'stonebraker@mit.edu', '$2b$12$eX9vU2M3y8FhO.04', 'Reviewer');

INSERT INTO institutions (institution_id, name, country, website) VALUES
(1, 'PES University', 'India', 'https://pes.edu'),
(2, 'Indian Institute of Science (IISc)', 'India', 'https://iisc.ac.in'),
(3, 'Massachusetts Institute of Technology (MIT)', 'USA', 'https://mit.edu');

INSERT INTO conference_tracks (track_id, track_name, description, conference_name, year) VALUES
(1, 'Vector Databases & Semantic Retrieval', 'High-dimensional embeddings and IVFFlat indexation', 'VLDB 2026', 2026),
(2, 'AI-Driven DBMS Query Optimization', 'Learned cost models and join cardinality prediction', 'SIGMOD 2026', 2026);

INSERT INTO papers (paper_id, title, abstract, keywords, venue, doi, submitted_by, track_id, citation_count) VALUES
(1, 'Vector Indexing and Approximate Nearest Neighbor Search in Modern Relational DBMS',
 'Modern database management systems increasingly handle high-dimensional vector embeddings...',
 'vector database, ivfflat, hnsw, similarity search', 'VLDB 2026 Proceedings', '10.1145/3543873.3587311', 2, 1, 38),
(2, 'Semantic Citation Networks: Preserving Conceptual Linkages Across Academic Literature',
 'Traditional citation graphs rely solely on bibliographic metadata...',
 'citation network, semantic graph, abstract embeddings', 'SIGMOD 2026 Conference', '10.1145/3543873.3587312', 1, 1, 24);""")

# -------------------------------------------------------------
# CHAPTER 7: QUERIES
# -------------------------------------------------------------
add_heading_1("7. QUERIES")

add_heading_2("7.1 Simple Query with GROUP BY and AGGREGATE")
add_body("Problem: Aggregate the total papers, average citation counts, and average peer review scores grouped by conference track.", bold_prefix="7.1 Statement: ")
add_code("""SELECT 
    ct.track_name,
    ct.conference_name,
    COUNT(DISTINCT p.paper_id) AS total_papers,
    ROUND(AVG(p.citation_count), 2) AS avg_citations,
    ROUND(AVG(pr.rating), 2) AS avg_review_score
FROM conference_tracks ct
JOIN papers p ON ct.track_id = p.track_id
LEFT JOIN peer_reviews pr ON p.paper_id = pr.paper_id
WHERE pr.status = 'accepted' OR pr.status IS NULL
GROUP BY ct.track_id, ct.track_name, ct.conference_name
ORDER BY avg_citations DESC;""")

add_heading_2("7.2 UPDATE Operation")
add_body("Problem: Promotes pending peer review submissions with rating >= 8 to accepted status with oral presentation recommendation.", bold_prefix="7.2 Statement: ")
add_code("""UPDATE peer_reviews
SET status = 'accepted',
    recommendation = 'Strong paper - recommended for oral presentation'
WHERE rating >= 8 AND status = 'pending';""")

add_heading_2("7.3 DELETE Operation")
add_body("Problem: Safely delete a user bookmark while maintaining referential integrity across related foreign key constraints.", bold_prefix="7.3 Statement: ")
add_code("""DELETE FROM bookmarks
WHERE user_id = 2 AND paper_id = 4;""")

add_heading_2("7.4 Correlated Subquery")
add_body("Problem: Find all papers whose citation count is strictly higher than the average citation count of papers in their specific conference track.", bold_prefix="7.4 Statement: ")
add_code("""SELECT 
    p.paper_id,
    p.title,
    ct.track_name,
    p.citation_count,
    ROUND((
        SELECT AVG(p2.citation_count)
        FROM papers p2
        WHERE p2.track_id = p.track_id
    ), 2) AS track_avg_citations
FROM papers p
JOIN conference_tracks ct ON p.track_id = ct.track_id
WHERE p.citation_count > (
    SELECT AVG(p2.citation_count)
    FROM papers p2
    WHERE p2.track_id = p.track_id
)
ORDER BY p.citation_count DESC;""")

add_heading_2("7.5 Nested Subquery")
add_body("Problem: Select authors who have authored published papers where NONE of their authored works have ever been rejected by reviewers.", bold_prefix="7.5 Statement: ")
add_code("""SELECT 
    a.author_id,
    a.name,
    i.name AS institution_name,
    a.orcid
FROM authors a
JOIN institutions i ON a.institution_id = i.institution_id
WHERE a.author_id IN (
    SELECT pa.author_id
    FROM paper_authors pa
    WHERE pa.paper_id NOT IN (
        SELECT pr.paper_id
        FROM peer_reviews pr
        WHERE pr.status = 'rejected'
    )
)
ORDER BY a.name ASC;""")

# -------------------------------------------------------------
# CHAPTER 8: STORED PROCEDURES, FUNCTIONS AND TRIGGERS
# -------------------------------------------------------------
add_heading_1("8. STORED PROCEDURES, FUNCTIONS AND TRIGGERS")

add_heading_2("8.1 Stored Procedures and Functions")
add_body("1. calculate_h_index(p_author_id): Computes an author's bibliometric H-Index dynamically using the window function ROW_NUMBER().", bold_prefix="Function 1: ")
add_code("""CREATE OR REPLACE FUNCTION calculate_h_index(p_author_id BIGINT)
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
$$ LANGUAGE plpgsql;""")

add_body("2. generate_recommendations(p_user_id, p_limit): Generates personalized paper recommendations by ranking unread papers using a composite formula (60% citation count, 40% community bookmarks).", bold_prefix="Function 2: ")
add_code("""CREATE OR REPLACE FUNCTION generate_recommendations(p_user_id BIGINT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (paper_id BIGINT, title VARCHAR, score NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT p.paper_id, p.title,
           ROUND((p.citation_count * 0.6 + COUNT(DISTINCT b.bookmark_id) * 0.4)::NUMERIC, 2) AS score
    FROM papers p
    LEFT JOIN bookmarks b ON p.paper_id = b.paper_id
    WHERE p.paper_id NOT IN (
        SELECT paper_id FROM bookmarks WHERE user_id = p_user_id
    )
    GROUP BY p.paper_id, p.title, p.citation_count
    ORDER BY score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;""")

add_heading_2("8.2 Triggers Verification")
add_body("Automatic Citation Count Triggers: Synchronize papers.citation_count on citations insertion and deletion atomically.", bold_prefix="Triggers: ")
add_code("""CREATE OR REPLACE FUNCTION increment_citation_count()
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
EXECUTE FUNCTION increment_citation_count();""")

# -------------------------------------------------------------
# CHAPTER 9: VECTOR DB & NOSQL
# -------------------------------------------------------------
add_heading_1("9. VECTOR DATABASE & NOSQL IMPLEMENTATION")

add_heading_2("9.1 pgvector 1536-D Semantic Cosine Distance Search")
add_body("Paper abstracts are projected into high-dimensional vector spaces and indexed using IVFFlat. The pgvector <=> cosine distance operator calculates conceptual similarity between literature.")
add_code("""SELECT 
    p.paper_id,
    p.title,
    p.venue,
    ROUND((1 - (pe.embedding <=> target.embedding))::NUMERIC, 4) AS cosine_similarity
FROM papers p
JOIN paper_embeddings pe ON p.paper_id = pe.paper_id,
(
    SELECT embedding FROM paper_embeddings WHERE paper_id = 1
) target
WHERE p.paper_id <> 1
ORDER BY pe.embedding <=> target.embedding ASC
LIMIT 5;""")

add_heading_2("9.2 NoSQL JSONB Document Rubrics and Activity Feeds")
add_body("Peer review comments store unstructured multi-criteria rubrics in JSONB format, queried with -> and ->> operators.")
add_code("""SELECT 
    rc.comment_id,
    p.title,
    rc.comment_data->'rubric'->>'novelty' AS novelty_score,
    rc.comment_data->'rubric'->>'reproducibility' AS reproducibility_score,
    rc.comment_data->>'feedback' AS reviewer_comment
FROM review_comments rc
JOIN peer_reviews pr ON rc.review_id = pr.review_id
JOIN papers p ON pr.paper_id = p.paper_id
WHERE (rc.comment_data->'rubric'->>'reproducibility')::INTEGER >= 9;""")

# -------------------------------------------------------------
# CHAPTER 10: FRONT END DEVELOPMENT
# -------------------------------------------------------------
add_heading_1("10. FRONT END DEVELOPMENT (NEXT.JS 14)")
add_body("The front-end is developed using Next.js 14, React 18, and Tailwind CSS, communicating with database endpoints via Next.js API Routes.")
add_body("Key modules include:")
add_body("1. Dashboard (/): Real-time metrics bar, overview charts, and live JSONB audit stream.")
add_body("2. Paper Explorer (/papers): Search engine with dual Vector Cosine (pgvector) vs Full-Text (GIN) modes, track filters, and paper submission modal.")
add_body("3. Paper Graph & Reviews (/papers/[id]): Displays DOI metadata, directed citation graph, conceptual vector neighbors, and trigger verification button.")
add_body("4. Author Analytics (/authors): Bibliometric profiles displaying computed H-Index and publication lists.")
add_body("5. Peer Review Portal (/reviews): Submission interface supporting structured multi-criteria JSON rubrics.")
add_body("6. Interactive DBMS SQL Console (/dbms-lab): Live playground to run and inspect all report queries (7.1 to 10) with EXPLAIN plans, execution time in ms, and formatted table outputs.")

add_heading_1("REFERENCES / BIBLIOGRAPHY")
add_body("[1] PostgreSQL Global Development Group. 'PostgreSQL 16.4 Documentation', 2024. https://www.postgresql.org/docs/")
add_body("[2] pgvector Developers. 'Open-source vector similarity search for PostgreSQL', GitHub, 2024. https://github.com/pgvector/pgvector")
add_body("[3] Vercel Inc. 'Next.js 14 Full-Stack Framework Documentation', 2024. https://nextjs.org/docs")
add_body("[4] Stonebraker, M., et al. 'The Design and Implementation of Modern Relational Database Systems', ACM TODS.")
add_body("[5] PES University. 'UE23CS351A – Database Management Systems Course Guidelines', Dept of CSE, 2026.")

add_heading_1("APPENDIX A: DEFINITIONS, ACRONYMS AND ABBREVIATIONS")
add_body("• DBMS: Database Management System")
add_body("• 3NF: Third Normal Form")
add_body("• ACID: Atomicity, Consistency, Isolation, Durability")
add_body("• GIN: Generalized Inverted Index (PostgreSQL full-text)")
add_body("• IVFFlat: Inverted File with Flat Compression (vector clustering index)")
add_body("• JSONB: Binary JavaScript Object Notation (PostgreSQL document store)")
add_body("• ANN: Approximate Nearest Neighbor")
add_body("• DOI: Digital Object Identifier")
add_body("• GitHub Repository: https://github.com/adarshm1705/academic-research-portal")

output_path = r"C:\Users\adaap\.gemini\antigravity\scratch\academic_research_portal\DBMS_Project_Report_PES2UG24CS028_CS040.docx"
doc.save(output_path)
print(f"Report generated successfully: {output_path}")

