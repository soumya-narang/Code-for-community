package llm

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type Client struct {
	genaiClient *genai.Client
}

func NewClient() (*Client, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY environment variable not set")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create GenAI client: %v", err)
	}

	return &Client{
		genaiClient: client,
	}, nil
}

type AIResponse struct {
	NormalizedText string `json:"normalized_text"`
	Language       string `json:"language"`
	Category       string `json:"category"`
	Sentiment      string `json:"sentiment"`
}

// TranslateAndTag takes a raw submission and returns translation, detected language, sentiment, and category
func (c *Client) TranslateAndTag(ctx context.Context, rawText string) (normalizedText, language, category, sentiment string, err error) {
	model := c.genaiClient.GenerativeModel("gemini-1.5-flash-latest")
	model.ResponseMIMEType = "application/json"
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text("You are an AI assistant processing citizen complaints. Given a raw text submission, output a JSON object with the following fields:\n" +
				"- \"normalized_text\": Translate the text to clear English. If it is already English, fix spelling and grammar.\n" +
				"- \"language\": The detected source language (e.g., 'en', 'hi', 'te').\n" +
				"- \"category\": Must be exactly one of: 'Education', 'Health', 'Roads', 'Water', 'Electricity', 'Sanitation', or 'Other'.\n" +
				"- \"sentiment\": Determine the urgency. Must be one of: 'Low Concern', 'Moderate Concern', 'Urgent / Safety Risk', or 'Frustrated / Repeated Request'."),
		},
	}

	prompt := genai.Text(fmt.Sprintf("Raw submission: %q", rawText))
	resp, err := model.GenerateContent(ctx, prompt)
	if err != nil {
		return "", "", "", "", fmt.Errorf("failed to generate content: %v", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", "", "", "", fmt.Errorf("empty response from model")
	}

	part := resp.Candidates[0].Content.Parts[0]
	textPart, ok := part.(genai.Text)
	if !ok {
		return "", "", "", "", fmt.Errorf("unexpected response type from model")
	}

	var aiResp AIResponse
	if err := json.Unmarshal([]byte(textPart), &aiResp); err != nil {
		return "", "", "", "", fmt.Errorf("failed to unmarshal JSON: %v, raw text: %s", err, textPart)
	}

	return aiResp.NormalizedText, aiResp.Language, aiResp.Category, aiResp.Sentiment, nil
}

// GetEmbedding computes the embedding for a given text
func (c *Client) GetEmbedding(ctx context.Context, text string) ([]float32, error) {
	em := c.genaiClient.EmbeddingModel("embedding-001")
	res, err := em.EmbedContent(ctx, genai.Text(text))
	if err != nil {
		return nil, fmt.Errorf("failed to get embedding: %v", err)
	}
	if res.Embedding == nil || len(res.Embedding.Values) == 0 {
		return nil, fmt.Errorf("empty embedding response")
	}
	return res.Embedding.Values, nil
}

type ThemeDetails struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	SampleQuotes string `json:"sample_quotes"` // stringified JSON array
}

// GenerateThemeDetails generates title, description, and sample quotes for a cluster of submissions
func (c *Client) GenerateThemeDetails(ctx context.Context, submissions []string) (title, description, sampleQuotes string, err error) {
	model := c.genaiClient.GenerativeModel("gemini-1.5-flash-latest")
	model.ResponseMIMEType = "application/json"
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text("You are an AI assistant summarizing citizen complaints into a single cohesive development theme. Given a list of related complaints, output a JSON object with the following fields:\n" +
				"- \"title\": A short, actionable title (e.g., 'Ward 6 Primary School Upgrade').\n" +
				"- \"description\": A concise 2-3 sentence summary of the core issue and requests.\n" +
				"- \"sample_quotes\": A JSON array of strings containing 2 to 3 representative quotes from the raw submissions."),
		},
	}

	subsJSON, _ := json.Marshal(submissions)
	prompt := genai.Text(fmt.Sprintf("Submissions: %s", string(subsJSON)))
	resp, err := model.GenerateContent(ctx, prompt)
	if err != nil {
		return "", "", "", fmt.Errorf("failed to generate theme details: %v", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", "", "", fmt.Errorf("empty response from model")
	}

	textPart, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return "", "", "", fmt.Errorf("unexpected response type")
	}

	var details ThemeDetails
	if err := json.Unmarshal([]byte(textPart), &details); err != nil {
		return "", "", "", fmt.Errorf("failed to parse theme details: %v", err)
	}

	return details.Title, details.Description, details.SampleQuotes, nil
}

// GenerateJustification generates a one-line justification based on the score breakdown
func (c *Client) GenerateJustification(ctx context.Context, scoreBreakdown string) (string, error) {
	model := c.genaiClient.GenerativeModel("gemini-1.5-flash-latest")
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text("You are an AI prioritizing public works. Given a JSON representation of a score breakdown (volume, sentiment, demand_gap, recency), write a SINGLE SENTENCE justifying the priority score. Example: 'Ranked high due to severe demand gap: 3x population served with no transport link, despite fewer raw complaints.' Focus on the highest contributing factor."),
		},
	}

	prompt := genai.Text(fmt.Sprintf("Score Breakdown: %s", scoreBreakdown))
	resp, err := model.GenerateContent(ctx, prompt)
	if err != nil {
		return "", fmt.Errorf("failed to generate justification: %v", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty response")
	}

	textPart, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return "", fmt.Errorf("unexpected response type")
	}

	return string(textPart), nil
}
