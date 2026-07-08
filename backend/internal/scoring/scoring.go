package scoring

import (
	"github.com/soumya-narang/Code-for-community/backend/internal/models"
)

type ScoringEngine struct {
	// dependencies like DB or ML models if any
}

func NewScoringEngine() *ScoringEngine {
	return &ScoringEngine{}
}

// CalculatePriorityScore computes the priority score based on the 4 signals:
// 1. Citizen complaint volume (30%)
// 2. Urgency/sentiment (15%)
// 3. Demand-gap from public data (35%)
// 4. Recency/trend (20%)
func (s *ScoringEngine) CalculatePriorityScore(theme *models.Theme, submissions []models.Submission, wardData *models.WardData) (float64, map[string]interface{}) {
	// TODO: Implement the exact spec from section 6
	// Return the final score and the detailed breakdown
	breakdown := map[string]interface{}{
		"volume":     map[string]interface{}{"raw": len(submissions), "normalized": 0.5, "weight": 0.3, "contribution": 15.0},
		"sentiment":  map[string]interface{}{"raw": "high", "normalized": 1.0, "weight": 0.15, "contribution": 15.0},
		"demand_gap": map[string]interface{}{"raw": 3.0, "normalized": 0.8, "weight": 0.35, "contribution": 28.0},
		"recency":    map[string]interface{}{"raw": 10, "normalized": 0.5, "weight": 0.20, "contribution": 10.0},
	}
	finalScore := 68.0

	return finalScore, breakdown
}
