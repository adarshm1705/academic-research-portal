-- ==============================================================================
-- AI-POWERED ACADEMIC RESEARCH PORTAL - LAB QUERIES
-- DBMS Mini Project - UE23CS351A
-- Student: Adarsh Shivanand Madli (PES2UG24CS028)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 7.1 SIMPLE QUERY WITH GROUP BY AND AGGREGATE
-- Problem: Calculate the total number of accepted papers, average citation count,
-- and average peer review rating for each conference track.
-- ------------------------------------------------------------------------------
SELECT 
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
ORDER BY avg_citations DESC;


-- ------------------------------------------------------------------------------
-- 7.2 UPDATE OPERATION
-- Problem: Update author institution affiliation and recompute review recommendation status.
-- ------------------------------------------------------------------------------
-- Update 1: Promote author institution upon joining PES University faculty
UPDATE authors
SET institution_id = 1,
    email = 'dr.stonebraker@pes.edu'
WHERE author_id = 4;

-- Update 2: Automatically accept papers that scored a rating >= 8.0 in peer review
UPDATE peer_reviews
SET status = 'accepted',
    recommendation = 'Strong paper - recommended for oral presentation'
WHERE rating >= 8 AND status = 'pending';


-- ------------------------------------------------------------------------------
-- 7.3 DELETE OPERATION
-- Problem: Delete inactive reading lists while preserving referential integrity via CASCADE.
-- ------------------------------------------------------------------------------
-- Remove an item from a specific reading list
DELETE FROM list_items
WHERE list_id = 3 AND paper_id = 5;

-- Delete a user's bookmark when unbookmarked
DELETE FROM bookmarks
WHERE user_id = 2 AND paper_id = 4;


-- ------------------------------------------------------------------------------
-- 7.4 CORRELATED QUERY
-- Problem: Find all papers whose citation count is strictly higher than the 
-- average citation count of papers in their respective conference track.
-- ------------------------------------------------------------------------------
SELECT 
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
ORDER BY p.citation_count DESC;


-- ------------------------------------------------------------------------------
-- 7.5 NESTED QUERY
-- Problem: Retrieve authors who have published at least one paper and NONE of
-- their submitted papers have ever been rejected by any peer reviewer.
-- ------------------------------------------------------------------------------
SELECT 
    a.author_id,
    a.name,
    i.name AS institution_name,
    a.orcid
FROM authors a
JOIN institutions i ON a.institution_id = i.institution_id
WHERE a.author_id IN (
    -- Authors who have authored papers
    SELECT pa.author_id
    FROM paper_authors pa
    WHERE pa.paper_id NOT IN (
        -- Papers that received a rejected review
        SELECT pr.paper_id
        FROM peer_reviews pr
        WHERE pr.status = 'rejected'
    )
)
ORDER BY a.name ASC;


-- ------------------------------------------------------------------------------
-- 8.1 STORED PROCEDURES / FUNCTIONS EXECUTION
-- Execute H-Index calculation and personalized recommendations engine.
-- ------------------------------------------------------------------------------
-- Calculate H-Index for author 1 (Adarsh Shivanand Madli)
SELECT 
    a.author_id,
    a.name,
    calculate_h_index(a.author_id) AS computed_h_index
FROM authors a
WHERE a.author_id = 1;

-- Generate Top-5 Personalized Paper Recommendations for User 2
SELECT * FROM generate_recommendations(2, 5);


-- ------------------------------------------------------------------------------
-- 8.2 TRIGGERS VERIFICATION
-- 1. Full-text search trigger: verify tsvector is populated on INSERT/UPDATE
-- 2. Citation count trigger: verify paper citation_count automatically increments
-- ------------------------------------------------------------------------------
-- Check before citation count
SELECT paper_id, title, citation_count FROM papers WHERE paper_id = 2;

-- Insert a new citation (Paper 6 cites Paper 2)
INSERT INTO citations (citing_paper_id, cited_paper_id) VALUES (6, 2);

-- Check after: citation_count must have incremented by 1 automatically
SELECT paper_id, title, citation_count FROM papers WHERE paper_id = 2;


-- ------------------------------------------------------------------------------
-- 9. VECTOR SIMILARITY SEARCH (pgvector Cosine Distance)
-- Problem: Find top conceptually similar papers to a given paper using embedding vector distance.
-- ------------------------------------------------------------------------------
SELECT 
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
LIMIT 5;


-- ------------------------------------------------------------------------------
-- 10. NOSQL / JSONB QUERY OPERATIONS
-- Problem: Query unstructured review rubric scores and extract audit event logs.
-- ------------------------------------------------------------------------------
-- Extract rubric scores from JSONB review comments where reproducibility = 10
SELECT 
    rc.comment_id,
    p.title,
    rc.comment_data->'rubric'->>'novelty' AS novelty_score,
    rc.comment_data->'rubric'->>'reproducibility' AS reproducibility_score,
    rc.comment_data->>'feedback' AS reviewer_comment
FROM review_comments rc
JOIN peer_reviews pr ON rc.review_id = pr.review_id
JOIN papers p ON pr.paper_id = p.paper_id
WHERE (rc.comment_data->'rubric'->>'reproducibility')::INTEGER >= 9;

-- Query activity feeds for audit trail
SELECT 
    af.activity_id,
    u.name AS user_name,
    af.activity_type,
    af.details->>'action' AS performed_action,
    af.created_at
FROM activity_feeds af
JOIN users u ON af.user_id = u.user_id
ORDER BY af.created_at DESC;

