-- ==============================================================================
-- AI-POWERED ACADEMIC RESEARCH PORTAL
-- DBMS Mini Project - UE23CS351A
-- Student: Adarsh Shivanand Madli (PES2UG24CS028)
-- Department of Computer Science & Engineering, PES University
-- ==============================================================================

-- 01. Enable Vector Extension (pgvector for semantic search)
CREATE EXTENSION IF NOT EXISTS vector;

-- 02. Drop tables if existing (for clean migration)
DROP TABLE IF EXISTS activity_feeds CASCADE;
DROP TABLE IF EXISTS review_comments CASCADE;
DROP TABLE IF EXISTS list_items CASCADE;
DROP TABLE IF EXISTS reading_lists CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS citations CASCADE;
DROP TABLE IF EXISTS peer_reviews CASCADE;
DROP TABLE IF EXISTS reviewers CASCADE;
DROP TABLE IF EXISTS paper_authors CASCADE;
DROP TABLE IF EXISTS paper_embeddings CASCADE;
DROP TABLE IF EXISTS papers CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS institutions CASCADE;
DROP TABLE IF EXISTS conference_tracks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 03. Create Users Table
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('Researcher', 'Reviewer', 'Admin', 'Conference Chair')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 04. Create Institutions Table
CREATE TABLE institutions (
    institution_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    country VARCHAR(100),
    website VARCHAR(255)
);

-- 05. Create Authors Table
CREATE TABLE authors (
    author_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    orcid VARCHAR(50) UNIQUE,
    email VARCHAR(150),
    institution_id BIGINT REFERENCES institutions(institution_id) ON DELETE SET NULL
);

-- 06. Create Conference Tracks Table
CREATE TABLE conference_tracks (
    track_id BIGSERIAL PRIMARY KEY,
    track_name VARCHAR(150) NOT NULL,
    description TEXT,
    conference_name VARCHAR(200) NOT NULL,
    year INTEGER CHECK (year >= 1900)
);

-- 07. Create Papers Table
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

-- 08. Create Paper Authors Junction Table
CREATE TABLE paper_authors (
    paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES authors(author_id) ON DELETE CASCADE,
    author_order INTEGER NOT NULL CHECK (author_order > 0),
    PRIMARY KEY (paper_id, author_id),
    UNIQUE (paper_id, author_order)
);

-- 09. Create Paper Embeddings Table (Vector Database integration)
CREATE TABLE paper_embeddings (
    paper_id BIGINT PRIMARY KEY REFERENCES papers(paper_id) ON DELETE CASCADE,
    embedding VECTOR(1536),
    model_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create Reviewers Table
CREATE TABLE reviewers (
    reviewer_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    expertise TEXT,
    verified BOOLEAN DEFAULT FALSE
);

-- 11. Create Peer Reviews Table
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

-- 12. Create Citations Table (Citation Network)
CREATE TABLE citations (
    citation_id BIGSERIAL PRIMARY KEY,
    citing_paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    cited_paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (citing_paper_id <> cited_paper_id),
    UNIQUE (citing_paper_id, cited_paper_id)
);

-- 13. Create Bookmarks Table
CREATE TABLE bookmarks (
    bookmark_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, paper_id)
);

-- 14. Create Reading Lists & List Items (NoSQL / List Collections)
CREATE TABLE reading_lists (
    list_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE list_items (
    list_item_id BIGSERIAL PRIMARY KEY,
    list_id BIGINT NOT NULL REFERENCES reading_lists(list_id) ON DELETE CASCADE,
    paper_id BIGINT NOT NULL REFERENCES papers(paper_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (list_id, paper_id)
);

-- 15. Create Review Comments Table (NoSQL Document Store / JSONB)
CREATE TABLE review_comments (
    comment_id BIGSERIAL PRIMARY KEY,
    review_id BIGINT NOT NULL REFERENCES peer_reviews(review_id) ON DELETE CASCADE,
    comment_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Create Activity Feeds Table (Audit & Event Log / JSONB)
CREATE TABLE activity_feeds (
    activity_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    ref_id BIGINT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==============================================================================
CREATE INDEX idx_papers_submitted_by ON papers(submitted_by);
CREATE INDEX idx_papers_track ON papers(track_id);
CREATE INDEX idx_paper_authors_author ON paper_authors(author_id);
CREATE INDEX idx_peer_reviews_paper ON peer_reviews(paper_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_citations_cited_paper ON citations(cited_paper_id);
CREATE INDEX idx_activity_feeds_user ON activity_feeds(user_id);
CREATE INDEX idx_papers_fulltext ON papers USING GIN (fulltext_tsv);
CREATE INDEX idx_paper_embeddings_vector ON paper_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ==============================================================================
-- STORED FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Trigger 1: Full-Text Search tsvector auto-update
CREATE OR REPLACE FUNCTION update_paper_fulltext()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fulltext_tsv := 
        to_tsvector('english', 
            COALESCE(NEW.title, '') || ' ' || 
            COALESCE(NEW.abstract, '') || ' ' || 
            COALESCE(NEW.keywords, '')
        );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_paper_fulltext
BEFORE INSERT OR UPDATE OF title, abstract, keywords
ON papers
FOR EACH ROW
EXECUTE FUNCTION update_paper_fulltext();

-- Trigger 2: Automatic Citation Count Incrementation
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

-- Trigger 3: Automatic Citation Count Decrementation
CREATE OR REPLACE FUNCTION decrement_citation_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE papers
    SET citation_count = GREATEST(citation_count - 1, 0)
    WHERE paper_id = OLD.cited_paper_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_citation_count
AFTER DELETE ON citations
FOR EACH ROW
EXECUTE FUNCTION decrement_citation_count();

-- Function 1: Author H-Index Calculation
CREATE OR REPLACE FUNCTION calculate_h_index(p_author_id BIGINT)
RETURNS INTEGER AS $$
DECLARE
    h INTEGER := 0;
BEGIN
    SELECT COUNT(*)
    INTO h
    FROM (
        SELECT p.citation_count,
               ROW_NUMBER() OVER (ORDER BY p.citation_count DESC) AS rn
        FROM papers p
        JOIN paper_authors pa ON p.paper_id = pa.paper_id
        WHERE pa.author_id = p_author_id
    ) ranked
    WHERE citation_count >= rn;
    RETURN h;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Personalized Research Recommendation Engine
CREATE OR REPLACE FUNCTION generate_recommendations(
    p_user_id BIGINT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    paper_id BIGINT,
    title VARCHAR,
    score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.paper_id,
           p.title,
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
$$ LANGUAGE plpgsql;

