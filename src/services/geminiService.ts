
import { GoogleGenAI } from "@google/genai";
import { AbandonedIdea, SynthesisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * High-fidelity synthesis using Gemini 3 Flash with Google Search Grounding.
 * Used for the main dashboard to provide research-grade insights.
 */
export const getFailureSynthesis = async (ideas: AbandonedIdea[]): Promise<SynthesisResult> => {
  if (ideas.length === 0) return { text: "No data available in the archive for synthesis.", sources: [] };

  const prompt = `
    Analyze the following repository of abandoned startup ideas. 
    Then, use Google Search to cross-reference these failures with current 2024-2025 market trends and economic conditions.
    
    Provide a concise, neutral 3-paragraph synthesis:
    1. Common patterns across the internal descriptions.
    2. External market context (using search results) that explains why these specific types of ideas are stopping now.
    3. A clinical takeaway for future builders.

    Internal Repository Data: ${JSON.stringify(ideas.map(i => ({ desc: i.description, reason: i.primaryReason })))}

    Tone: Academic, neutral, objective archive. No motivational fluff.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Synthesis result unavailable.";
    
    // Extracting grounding sources as required by Google Search Grounding rules
    const sources: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || "Source",
            uri: chunk.web.uri
          });
        }
      });
    }

    // Remove duplicate sources
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);

    return { text, sources: uniqueSources };
  } catch (error) {
    console.error("Gemini Deep Synthesis Error:", error);
    return { text: "Error generating synthesis.", sources: [] };
  }
};

/**
 * Low-latency "Quick Analysis" using Gemini Flash Lite.
 * Used for immediate feedback during submission or archive browsing.
 */
export const getQuickAnalysis = async (ideaDescription: string): Promise<string> => {
  if (!ideaDescription || ideaDescription.length < 20) return "";

  const prompt = `
    Provide a clinical, 1-sentence "Objective Risk Factor" for the following project description.
    Focus on structural weakness, not motivation.
    
    Project: ${ideaDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Lite Error:", error);
    return "";
  }
};
