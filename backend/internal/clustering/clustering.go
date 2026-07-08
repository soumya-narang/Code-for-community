package clustering

import (
	"context"
	"encoding/json"
	"math"

	"github.com/google/uuid"
	"github.com/soumya-narang/Code-for-community/backend/internal/llm"
	"github.com/soumya-narang/Code-for-community/backend/internal/models"
	"gorm.io/gorm"
)

type ClusteringEngine struct {
	llmClient *llm.Client
	db        *gorm.DB
}

func NewClusteringEngine(llmClient *llm.Client, db *gorm.DB) *ClusteringEngine {
	return &ClusteringEngine{
		llmClient: llmClient,
		db:        db,
	}
}

func cosineSimilarity(a, b []float32) float64 {
	if len(a) != len(b) || len(a) == 0 {
		return 0
	}
	var dotProduct, normA, normB float64
	for i := 0; i < len(a); i++ {
		dotProduct += float64(a[i]) * float64(b[i])
		normA += float64(a[i]) * float64(a[i])
		normB += float64(b[i]) * float64(b[i])
	}
	if normA == 0 || normB == 0 {
		return 0
	}
	return dotProduct / (math.Sqrt(normA) * math.Sqrt(normB))
}

// ClusterSubmission takes a new submission and either assigns it to an existing theme or creates a new one
func (c *ClusteringEngine) ClusterSubmission(ctx context.Context, submission *models.Submission) (*models.Theme, error) {
	// 1. Get embedding for new submission
	embedding, err := c.llmClient.GetEmbedding(ctx, submission.NormalizedText)
	if err != nil {
		return nil, err
	}

	// 2. We need to find all submissions in the same ward and category to compare
	// For MVP, we will fetch all existing themes in the ward + category, and compare against their "average" embedding, 
	// or more simply, we can just fetch one representative submission per theme.
	// Since we don't store embeddings in the DB yet, we can re-embed the Theme's description.
	// (In a real app with pgvector, we would do a vector search here).

	var existingThemes []models.Theme
	if err := c.db.Where("ward = ? AND category = ?", submission.Ward, submission.Category).Find(&existingThemes).Error; err != nil {
		return nil, err
	}

	var bestTheme *models.Theme
	bestScore := -1.0

	for i := range existingThemes {
		theme := &existingThemes[i]
		// Embed the theme description to compare
		themeEmb, err := c.llmClient.GetEmbedding(ctx, theme.Description)
		if err != nil {
			continue // skip on error
		}

		score := cosineSimilarity(embedding, themeEmb)
		if score > bestScore {
			bestScore = score
			bestTheme = theme
		}
	}

	threshold := 0.75 // 75% similarity threshold

	if bestTheme != nil && bestScore >= threshold {
		// Found a match
		submission.ThemeID = &bestTheme.ID
		c.db.Save(submission)

		// Re-generate theme details (title, desc, quotes) based on updated cluster
		var subs []models.Submission
		c.db.Where("theme_id = ?", bestTheme.ID).Find(&subs)
		
		var rawTexts []string
		for _, s := range subs {
			rawTexts = append(rawTexts, s.NormalizedText)
		}
		
		title, desc, quotes, _ := c.llmClient.GenerateThemeDetails(ctx, rawTexts)
		if title != "" {
			bestTheme.Title = title
			bestTheme.Description = desc
			bestTheme.SampleQuotes = quotes
		}
		bestTheme.SubmissionCount = len(subs)
		c.db.Save(bestTheme)
		
		return bestTheme, nil
	}

	// Create a new Theme
	newTheme := &models.Theme{
		ID:               uuid.New(),
		Category:         submission.Category,
		Ward:             submission.Ward,
		SubmissionCount:  1,
		Status:           "proposed",
	}

	title, desc, quotes, err := c.llmClient.GenerateThemeDetails(ctx, []string{submission.NormalizedText})
	if err == nil && title != "" {
		newTheme.Title = title
		newTheme.Description = desc
		newTheme.SampleQuotes = quotes
	} else {
		newTheme.Title = "New Request: " + submission.Category
		newTheme.Description = submission.NormalizedText
		quotesBytes, _ := json.Marshal([]string{submission.RawText})
		newTheme.SampleQuotes = string(quotesBytes)
	}

	c.db.Create(newTheme)
	
	submission.ThemeID = &newTheme.ID
	c.db.Save(submission)

	return newTheme, nil
}
