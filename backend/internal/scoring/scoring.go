package scoring

import (
	"context"
	"encoding/json"

	"github.com/soumya-narang/Code-for-community/backend/internal/llm"
	"github.com/soumya-narang/Code-for-community/backend/internal/models"
	"gorm.io/gorm"
)

type ScoringEngine struct {
	llmClient *llm.Client
	db        *gorm.DB
}

func NewScoringEngine(llmClient *llm.Client, db *gorm.DB) *ScoringEngine {
	return &ScoringEngine{
		llmClient: llmClient,
		db:        db,
	}
}

// ScoreTheme recalculates and saves the priority score for a theme
func (s *ScoringEngine) ScoreTheme(ctx context.Context, theme *models.Theme) error {
	var submissions []models.Submission
	if err := s.db.Where("theme_id = ?", theme.ID).Find(&submissions).Error; err != nil {
		return err
	}

	var wardData models.WardData
	// If ward data is missing, we use defaults
	s.db.Where("ward = ?", theme.Ward).First(&wardData)

	// Calculate Volume (max assumed around 100 for normalization)
	volRaw := float64(len(submissions))
	volNorm := volRaw / 100.0
	if volNorm > 1.0 {
		volNorm = 1.0
	}

	// Calculate Sentiment
	var sentTotal float64
	for _, sub := range submissions {
		switch sub.Sentiment {
		case "Urgent / Safety Risk":
			sentTotal += 1.0
		case "Frustrated / Repeated Request":
			sentTotal += 0.8
		case "Moderate Concern":
			sentTotal += 0.5
		default:
			sentTotal += 0.2
		}
	}
	sentRaw := sentTotal / float64(len(submissions))
	sentNorm := sentRaw // already 0-1

	// Calculate Demand Gap
	// Using a simple heuristic: (Population / SeatsAvailable) or Distance
	// For MVP, if no data, default to 0.5
	demandRaw := 0.5
	demandNorm := 0.5
	if wardData.Population > 0 && wardData.SeatsAvailable > 0 {
		ratio := float64(wardData.Population) / float64(wardData.SeatsAvailable)
		demandRaw = ratio
		demandNorm = ratio / 5.0 // Cap at 5.0 ratio -> 1.0
		if demandNorm > 1.0 {
			demandNorm = 1.0
		}
	}
	
	// If it's something like roads, distance matters more
	if theme.Category == "Roads" && wardData.DistanceToNearestFacilityKm > 0 {
		demandRaw = wardData.DistanceToNearestFacilityKm
		demandNorm = demandRaw / 20.0 // 20km = 1.0
		if demandNorm > 1.0 {
			demandNorm = 1.0
		}
	}

	// Recency (For MVP, static 0.5 since we don't have historical data to compare trends)
	recencyRaw := 0.5
	recencyNorm := 0.5

	// Weights
	wVol := 0.30
	wSent := 0.15
	wDemand := 0.35
	wRecency := 0.20

	finalScore := (volNorm*wVol + sentNorm*wSent + demandNorm*wDemand + recencyNorm*wRecency) * 100.0

	breakdown := map[string]interface{}{
		"volume":      map[string]interface{}{"raw": volRaw, "normalized": volNorm, "weight": wVol, "contribution": volNorm * wVol * 100},
		"sentiment":   map[string]interface{}{"raw": sentRaw, "normalized": sentNorm, "weight": wSent, "contribution": sentNorm * wSent * 100},
		"demand_gap":  map[string]interface{}{"raw": demandRaw, "normalized": demandNorm, "weight": wDemand, "contribution": demandNorm * wDemand * 100},
		"recency":     map[string]interface{}{"raw": recencyRaw, "normalized": recencyNorm, "weight": wRecency, "contribution": recencyNorm * wRecency * 100},
	}

	breakdownJSON, _ := json.Marshal(breakdown)

	// Call LLM for Justification
	justification, err := s.llmClient.GenerateJustification(ctx, string(breakdownJSON))
	if err != nil || justification == "" {
		justification = "Ranked based on citizen volume and available public data."
	}

	// Update Theme
	theme.PriorityScore = finalScore
	theme.ScoreBreakdown = string(breakdownJSON)
	theme.WhyJustification = justification

	return s.db.Save(theme).Error
}
