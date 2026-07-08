package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/soumya-narang/Code-for-community/backend/internal/llm"
	"github.com/soumya-narang/Code-for-community/backend/internal/models"
	"gorm.io/gorm"
)

type Handler struct {
	DB  *gorm.DB
	LLM *llm.Client
}

func RegisterRoutes(e *echo.Echo, db *gorm.DB, llmClient *llm.Client) {
	h := &Handler{DB: db, LLM: llmClient}

	// Health check
	e.GET("/health", h.HealthCheck)

	// API Group
	api := e.Group("/api")

	// Submissions
	api.POST("/submissions", h.CreateSubmission)
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

	// Async trigger clustering here later
	// go func() { ... }()

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"tracking_id":     sub.TrackingID,
		"normalized_text": sub.NormalizedText,
		"category":        sub.Category,
		"sentiment":       sub.Sentiment,
	})
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
	return c.JSON(http.StatusOK, []string{})
}

func (h *Handler) GetTheme(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{})
}

func (h *Handler) UpdateThemeStatus(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{})
}
