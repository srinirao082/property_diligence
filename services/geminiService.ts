import { GoogleGenAI, Type } from "@google/genai";
import { DueDiligenceReport } from "../types";

// Initialize the Gemini API client
// The API key is injected via the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePropertyDocument = async (
  base64Data: string,
  mimeType: string
): Promise<DueDiligenceReport> => {
  const modelId = "gemini-2.5-flash"; // Using flash for efficient document processing

  // Define the schema for strict JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      reportSummary: {
        type: Type.STRING,
        description: "A professional executive summary of the property document analysis."
      },
      propertyDetails: {
        type: Type.OBJECT,
        properties: {
          address: { type: Type.STRING },
          surveyNumber: { type: Type.STRING },
          totalArea: { type: Type.STRING },
          propertyType: { type: Type.STRING },
          zoneType: { type: Type.STRING, description: "Residential, Commercial, Agricultural, etc." }
        },
        required: ["address", "surveyNumber", "totalArea", "propertyType"]
      },
      currentOwner: { type: Type.STRING },
      ownershipHistory: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            transactionType: { type: Type.STRING, description: "Sale Deed, Mortgage, Release Deed, etc." },
            from: { type: Type.STRING },
            to: { type: Type.STRING },
            amount: { type: Type.STRING },
            documentNumber: { type: Type.STRING },
            details: { type: Type.STRING }
          },
          required: ["date", "transactionType", "from", "to"]
        }
      },
      encumbrances: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of active liabilities, mortgages, or court stays."
      },
      financials: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "Brief summary of financial observations (taxes, dues)." },
          lastTransactionValue: { type: Type.STRING, description: "The value of the most recent transaction." },
          taxStatus: { type: Type.STRING, description: "Current status of property taxes (Paid/Pending/Unknown)." }
        },
        required: ["summary", "lastTransactionValue", "taxStatus"]
      },
      legalClauses: {
        type: Type.ARRAY,
        description: "Key legal clauses extracted from the document.",
        items: {
          type: Type.OBJECT,
          properties: {
            clause: { type: Type.STRING, description: "Title of the clause (e.g., Indemnity, Easement)." },
            explanation: { type: Type.STRING, description: "Simple explanation of what this means for the buyer." },
            significance: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] }
          },
          required: ["clause", "explanation", "significance"]
        }
      },
      riskAssessment: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
          score: { type: Type.INTEGER, description: "Risk score from 0 (Safe) to 100 (Risky)" },
          factors: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, description: "e.g., Zoning, Environmental, Title, Financial" },
                risk: { type: Type.STRING, description: "Name of the risk" },
                severity: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
                explanation: { type: Type.STRING }
              },
              required: ["category", "risk", "severity", "explanation"]
            } 
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["riskLevel", "score", "factors", "recommendations"]
      }
    },
    required: ["reportSummary", "propertyDetails", "currentOwner", "ownershipHistory", "encumbrances", "financials", "legalClauses", "riskAssessment"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `You are a senior real estate lawyer and property verification expert. 
            Analyze the attached property document (Encumbrance Certificate, Sale Deed, or Property Tax Receipt).
            
            Perform a rigorous due diligence check with a focus on Risk Assessment and Financial Summarization.
            
            1. **Property Details**: Identify accurate location, survey numbers, and area.
            2. **Title Flow**: Trace ownership history.
            3. **Financial Data**: Extract financial specifics. Look for transaction values, tax payment status, and any outstanding dues mentions.
            4. **Legal Clauses**: Identify critical clauses like Indemnity, Right of Way (Easements), Restrictive Covenants, or Dispute Resolution. Summarize them simply.
            5. **Risk Assessment Module**:
               - Analyze for **Zoning Issues** (e.g., residential property in green belt).
               - Check for **Environmental Concerns** (e.g., proximity to lakes/protected areas, if mentioned or inferred from location).
               - Flag **Title Defects** (broken chain of documents).
               - Assign a severity (HIGH/MEDIUM/LOW) to each risk factor.
            
            Return a JSON response strictly matching the provided schema.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for factual extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(text) as DueDiligenceReport;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
