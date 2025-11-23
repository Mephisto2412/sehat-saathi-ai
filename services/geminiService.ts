import { GoogleGenAI, Type } from "@google/genai";
import { IntentType, ExtractedHealthData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LANGUAGE_MAP: Record<string, string> = {
  'en-IN': 'English',
  'hi-IN': 'Hindi (Devanagari script)',
  'gu-IN': 'Gujarati (MUST use Gujarati script)',
  'mr-IN': 'Marathi (Devanagari script)',
  'bn-IN': 'Bengali (Bengali script)',
  'kn-IN': 'Kannada (Kannada script)'
};

/**
 * Step 1: Router / Intent Classifier
 */
export const classifyIntent = async (query: string): Promise<IntentType> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are the Router Agent for 'Sehat Saathi', a rural maternal health app.
      Classify the user query into one of these categories.
      
      Categories:
      - 'schemes': Questions about money, 5000/6000 rupees, PMMVY, JSY, government help, bank transfer, financial aid.
      - 'personal': Appointments, specific reports, doctor name.
      - 'medical': General health, diet, baby growth, symptoms.
      - 'emergency': Bleeding, water breaking, severe pain, no movement, high fever.
      - 'greeting': Namaste, Hello, casual chat.

      Query: "${query}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              enum: [
                IntentType.PERSONAL,
                IntentType.MEDICAL,
                IntentType.EMERGENCY,
                IntentType.SCHEMES,
                IntentType.GREETING,
                IntentType.UNKNOWN
              ]
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return json.intent as IntentType || IntentType.UNKNOWN;

  } catch (error) {
    console.error("Error classifying intent:", error);
    return IntentType.UNKNOWN;
  }
};

/**
 * Step 2: Emergency Response Generator
 */
export const generateEmergencyResponse = async (query: string, languageCode: string = 'en-IN'): Promise<string> => {
  const model = "gemini-2.5-flash";
  const targetLang = LANGUAGE_MAP[languageCode] || 'English';
  
  const prompt = `
    You are a strictly controlled medical alert system for Sehat Saathi.
    The user has reported a potential emergency: "${query}".
    
    INSTRUCTIONS:
    1. Respond ONLY in ${targetLang}. 
    2. Tone: Urgent, Directive, Serious.
    3. Content: State this is a danger sign. Tell her to call the ASHA worker or go to the hospital immediately.
    4. Do NOT provide home remedies.
    5. Keep it under 2 sentences.
    6. IMPORTANT: If the target language is Gujarati, you MUST write in Gujarati Script.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response.text || "Please go to the hospital immediately.";
};

/**
 * Step 3: RAG Response Generator
 */
export const generateRAGResponse = async (
  query: string,
  contextDocs: string[],
  intent: IntentType,
  languageCode: string = 'en-IN'
): Promise<string> => {
  const model = "gemini-2.5-flash";
  const targetLang = LANGUAGE_MAP[languageCode] || 'English';
  
  const prompt = `
    You are 'Sehat Saathi', a helpful health companion for rural women.
    
    User Query: "${query}"
    TARGET LANGUAGE: ${targetLang}
    
    CONTEXT INFORMATION (Source of Truth):
    =====================
    ${contextDocs.join('\n\n')}
    =====================

    STRICT RULES:
    1. OUTPUT MUST BE IN ${targetLang}. Do not output English unless requested.
    2. FOR GUJARATI: YOU MUST USE GUJARATI SCRIPT. Do not use Hindi or English.
    3. Use simple, respectful language suitable for rural women.
    4. Answer strictly based on the CONTEXT provided.
    5. If explaining schemes (PMMVY/JSY), be very clear about the amounts and steps.
    6. Keep the answer concise (max 3-4 sentences).
    7. If context is missing, advise asking the ASHA worker.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response.text || "I cannot find that information right now. Please ask your ASHA didi.";
};

/**
 * Step 4: Background Clinical Data Extraction
 */
export const analyzeHealthData = async (query: string): Promise<ExtractedHealthData | null> => {
  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
      Analyze this message for the ASHA Dashboard.
      Extract clinical data.
      
      CRITICAL RISK RULES:
      1. HYPERTENSION: If BP > 140/90 or mentions "headache + blurry vision".
      2. ANAEMIA: If mentions "pale", "dizzy", "weakness", or Hb < 11.
      3. DIABETES: If mentions "excessive thirst", "frequent urination".
      4. HAEMORRHAGE: If mentions "bleeding", "soaking pads", "spotting".
      5. LABOR: If mentions "water broke", "contractions".
      
      User Message: "${query}"
      
      Response Format (JSON):
      {
        "symptoms": [{"symptom": "string", "severity": "string", "timestamp": "ISO string"}],
        "medications": [{"name": "string", "status": "string"}],
        "vitals": {"blood_pressure": "string", "fetal_movement": "string"},
        "action_needed": "low" | "moderate" | "critical",
        "summary": "string",
        "suspected_conditions": ["string"] 
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as ExtractedHealthData;

  } catch (error) {
    console.error("Clinical extraction error:", error);
    return null;
  }
};