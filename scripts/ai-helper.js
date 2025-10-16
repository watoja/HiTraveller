/****************************************************
 * FILE: ai-helper.js
 * ---------------------------------------------
 * PURPOSE:
 *  Centralized helper for OpenAI API requests.
 *  Handles text generation, summarization, and AI prompts.
 * 
 *  API DOCS: https://platform.openai.com/docs/api-reference/chat
 ****************************************************/

// Replace with your valid OpenAI API key (local testing only).
export const OPENAI_API_KEY = "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"; 
export const USE_DEMO_MODE = false;

/****************************************************
 * FUNCTION: askOpenAI(prompt, role)
 * ---------------------------------
 * Sends a chat message to OpenAI's GPT model and returns
 * a natural-language response.
 * 
 * PARAMETERS:
 *  - prompt: The user query or task description.
 *  - role: Context (e.g. "travel planner" or "destination expert").
 ****************************************************/
export async function askOpenAI(prompt, role = "travel assistant") {
  if (USE_DEMO_MODE) {
    return `🤖 [Demo Mode] Example response for: "${prompt.slice(0, 50)}..."`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are HiTraveller, a helpful ${role}.` },
          { role: "user", content: prompt },
        ],
      }),
    });

    // Validate API response
    if (!response.ok) {
      const errText = await response.text();
      console.error("⚠️ OpenAI Error:", errText);
      return "⚠️ API error — check your key or internet connection.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from AI model.";
  } catch (error) {
    console.error("❌ OpenAI request failed:", error);
    return "⚠️ Connection failed. Please try again later.";
  }
}
