package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Submission struct {
	ID             uuid.UUID  `gorm:"type:uuid;primary_key;" json:"id"`
	TrackingID     string     `gorm:"uniqueIndex" json:"tracking_id"`
	RawText        string     `json:"raw_text"`
	NormalizedText string     `json:"normalized_text"`
	Language       string     `json:"language"`
	Category       string     `json:"category"`
	Ward           string     `json:"ward"`
	Lat            float64    `json:"lat"`
	Lng            float64    `json:"lng"`
	PhotoURL       *string    `json:"photo_url"`
	Sentiment      string     `json:"sentiment"`
	ThemeID        *uuid.UUID `gorm:"type:uuid" json:"theme_id"`
	CreatedAt      time.Time  `json:"created_at"`
}

func (base *Submission) BeforeCreate(tx *gorm.DB) (err error) {
	if base.ID == uuid.Nil {
		base.ID = uuid.New()
	}
	return
}

type Theme struct {
	ID               uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	Category         string    `json:"category"`
	Ward             string    `json:"ward"`
	SubmissionCount  int       `json:"submission_count"`
	SampleQuotes     string    `json:"sample_quotes"` // Stored as JSON string to simulate string array
	PriorityScore    float64   `json:"priority_score"`
	ScoreBreakdown   string    `json:"score_breakdown"` // Stored as JSON string
	WhyJustification string    `json:"why_justification"`
	Status           string    `json:"status"` // proposed, in_progress, completed
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

func (base *Theme) BeforeCreate(tx *gorm.DB) (err error) {
	if base.ID == uuid.Nil {
		base.ID = uuid.New()
	}
	return
}

type StatusUpdate struct {
	ID            uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	ThemeID       uuid.UUID `gorm:"type:uuid" json:"theme_id"`
	FromStatus    string    `json:"from_status"`
	ToStatus      string    `json:"to_status"`
	Justification string    `json:"justification"`
	CreatedAt     time.Time `json:"created_at"`
}

func (base *StatusUpdate) BeforeCreate(tx *gorm.DB) (err error) {
	if base.ID == uuid.Nil {
		base.ID = uuid.New()
	}
	return
}

type WardData struct {
	Ward                        string  `gorm:"primaryKey" json:"ward"`
	Enrollment                  int     `json:"enrollment"`
	SeatsAvailable              int     `json:"seats_available"`
	Population                  int     `json:"population"`
	DistanceToNearestFacilityKm float64 `json:"distance_to_nearest_facility_km"`
	FacilityType                string  `json:"facility_type"`
}
