package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/soumya-narang/Code-for-community/backend/internal/clustering"
	"github.com/soumya-narang/Code-for-community/backend/internal/handlers"
	"github.com/soumya-narang/Code-for-community/backend/internal/llm"
	"github.com/soumya-narang/Code-for-community/backend/internal/models"
	"github.com/soumya-narang/Code-for-community/backend/internal/scoring"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	// Load .env
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading, continuing with environment variables")
	}

	// Initialize Database
	db, err := gorm.Open(sqlite.Open("civix.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Auto Migrate the schema
	err = db.AutoMigrate(&models.Submission{}, &models.Theme{}, &models.StatusUpdate{}, &models.WardData{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	// Initialize Echo instance
	e := echo.New()

	// Initialize LLM Client
	llmClient, err := llm.NewClient()
	if err != nil {
		log.Fatalf("failed to initialize LLM client: %v", err)
	}

	ce := clustering.NewClusteringEngine(llmClient, db)
	se := scoring.NewScoringEngine(llmClient, db)

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Register Routes
	handlers.RegisterRoutes(e, db, llmClient, ce, se)

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}
