package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/soumya-narang/Code-for-community/backend/internal/clustering"
	"github.com/soumya-narang/Code-for-community/backend/internal/llm"
	"github.com/soumya-narang/Code-for-community/backend/internal/models"
	"github.com/soumya-narang/Code-for-community/backend/internal/scoring"
	"gorm.io/gorm"
)

type Handler struct {
	DB               *gorm.DB
	LLM              *llm.Client
	ClusteringEngine *clustering.ClusteringEngine
	ScoringEngine    *scoring.ScoringEngine
}

func RegisterRoutes(e *echo.Echo, db *gorm.DB, llmClient *llm.Client, ce *clustering.ClusteringEngine, se *scoring.ScoringEngine) {
	h := &Handler{DB: db, LLM: llmClient, ClusteringEngine: ce, ScoringEngine: se}

	// Health check
	e.GET("/health", h.HealthCheck)

	// API Group
	api := e.Group("/api")

	// Submissions
	api.POST("/submissions", h.CreateSubmission)
	api.POST("/seed", h.SeedWardData)
	api.GET("/submissions", h.GetSubmissions)

	// Themes
	api.GET("/themes", h.GetThemes)
	api.GET("/themes/:id", h.GetTheme)
	api.POST("/themes/:id/status", h.UpdateThemeStatus)
}

func (h *Handler) HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

type CreateSubmissionRequest struct {
	RawText  string  `json:"raw_text"`
	Category string  `json:"category"`
	Ward     string  `json:"ward"`
	Lat      float64 `json:"lat"`
	Lng      float64 `json:"lng"`
}

func (h *Handler) CreateSubmission(c echo.Context) error {
	var req CreateSubmissionRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request body"})
	}

	if req.RawText == "" || req.Ward == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "raw_text and ward are required"})
	}

	// Use LLM to translate and tag the submission
	ctx := context.Background()
	normText, lang, cat, sent, err := h.LLM.TranslateAndTag(ctx, req.RawText)
	if err != nil {
		c.Logger().Errorf("LLM error: %v", err)
		// Fallback to defaults if AI fails
		normText = req.RawText
		lang = "unknown"
		cat = req.Category
		sent = "Moderate Concern"
	}

	sub := models.Submission{
		TrackingID:     generateTrackingID(),
		RawText:        req.RawText,
		NormalizedText: normText,
		Language:       lang,
		Category:       cat,
		Ward:           req.Ward,
		Lat:            req.Lat,
		Lng:            req.Lng,
		Sentiment:      sent,
	}

	if err := h.DB.Create(&sub).Error; err != nil {
		c.Logger().Errorf("DB error: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to save submission"})
	}

	// Trigger clustering
	theme, err := h.ClusteringEngine.ClusterSubmission(ctx, &sub)
	if err == nil && theme != nil {
		// Trigger scoring
		_ = h.ScoringEngine.ScoreTheme(ctx, theme)
	} else {
		c.Logger().Errorf("Clustering error: %v", err)
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"tracking_id":     sub.TrackingID,
		"normalized_text": sub.NormalizedText,
		"category":        sub.Category,
		"sentiment":       sub.Sentiment,
		"theme_id":        sub.ThemeID,
	})
}

// SeedWardData populates the database with canonical demo data
func (h *Handler) SeedWardData(c echo.Context) error {
	ward6Data := models.WardData{
		Ward:                        "Ward 6",
		Enrollment:                  1200,
		SeatsAvailable:              400, // severe demand gap for education
		Population:                  20000,
		DistanceToNearestFacilityKm: 15.0,
		FacilityType:                "School",
	}

	if err := h.DB.Save(&ward6Data).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to seed data"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "seeded successfully"})
}

// Generate unique tracking ID
func generateTrackingID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		return "CTX-0000"
	}
	return "CTX-" + hex.EncodeToString(bytes)
}

func (h *Handler) GetSubmissions(c echo.Context) error {
	var subs []models.Submission
	h.DB.Find(&subs)
	return c.JSON(http.StatusOK, subs)
}

func (h *Handler) GetThemes(c echo.Context) error {
	var themes []models.Theme
	if err := h.DB.Order("priority_score desc").Find(&themes).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to fetch themes"})
	}

	// For MVP, we need to return the expected structure for the frontend
	type FrontendTheme struct {
		ID                  string      `json:"id"`
		Theme               string      `json:"theme"`
		Ward                string      `json:"ward"`
		Category            string      `json:"category"`
		Score               float64     `json:"score"`
		SubmissionCount     int         `json:"submissionCount"`
		Justification       string      `json:"justification"`
		Status              string      `json:"status"`
		StatusJustification string      `json:"statusJustification,omitempty"`
		LastUpdated         string      `json:"lastUpdated"`
		Signals             interface{} `json:"signals"`
		Submissions         interface{} `json:"submissions"`
	}

	var result []FrontendTheme
	for _, t := range themes {
		// Mock mapping signals from breakdown
		ft := FrontendTheme{
			ID:              t.ID.String(),
			Theme:           t.Title,
			Ward:            t.Ward,
			Category:        t.Category,
			Score:           t.PriorityScore,
			SubmissionCount: t.SubmissionCount,
			Justification:   t.WhyJustification,
			Status:          t.Status,
			LastUpdated:     t.UpdatedAt.Format("2006-01-02T15:04:05Z"),
			Signals: []map[string]interface{}{
				{"label": "Citizen volume", "value": 30, "color": "bg-slate"},
				{"label": "Urgency", "value": 15, "color": "bg-slate"},
				{"label": "Demand gap", "value": 35, "color": "bg-signal"},
				{"label": "Recency", "value": 20, "color": "bg-slate"},
			},
			Submissions: []map[string]interface{}{},
		}
		
		// Map proper status to frontend enum
		if ft.Status == "proposed" {
			ft.Status = "In Review"
		}
		
		result = append(result, ft)
	}

	return c.JSON(http.StatusOK, result)
}

func (h *Handler) GetTheme(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{})
}

func (h *Handler) UpdateThemeStatus(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{})
}
