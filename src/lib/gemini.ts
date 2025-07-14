import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function getCropSuggestions(farmData: any) {
  try {
    const prompt = `As an Indian farming expert, suggest 3 best crops to grow. Use simple language. Respond ONLY with a JSON array of objects with exactly this structure, no other text:
[{
  "name": "Crop Name",
  "confidence": 95,
  "waterNeeds": "Low|Medium|High",
  "sunlight": "Full Sun|Partial Shade|Full Shade",
  "temperature": "Temperature range in F",
  "description": "Why this crop is suitable (use simple Indian English)",
  "organicGuide": {
    "preparation": ["Simple step 1", "Simple step 2", "Simple step 3"],
    "planting": ["Simple step 1", "Simple step 2", "Simple step 3"],
    "maintenance": ["Simple step 1", "Simple step 2", "Simple step 3"],
    "harvesting": ["Simple step 1", "Simple step 2", "Simple step 3"]
  }
}]

Farm data:
- Soil Type: ${farmData.soilType}
- Land Size: ${farmData.landSize} acres
- Location: ${farmData.location}
- Water Availability: ${farmData.waterAvailability}
- Previous Crops: ${farmData.previousCrops}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const suggestions = JSON.parse(cleanText);
      
      if (!Array.isArray(suggestions)) {
        throw new Error('Response is not an array');
      }

      return suggestions.map(suggestion => ({
        name: suggestion.name || 'Unknown Crop',
        confidence: Number(suggestion.confidence) || 0,
        waterNeeds: suggestion.waterNeeds || 'Medium',
        sunlight: suggestion.sunlight || 'Full Sun',
        temperature: suggestion.temperature || 'N/A',
        description: suggestion.description || 'No description available',
        organicGuide: suggestion.organicGuide || {
          preparation: [],
          planting: [],
          maintenance: [],
          harvesting: []
        }
      }));
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      return [{
        name: "Unable to get suggestions",
        confidence: 0,
        waterNeeds: "Medium",
        sunlight: "Full Sun",
        temperature: "N/A",
        description: "There was an error processing the AI response. Please try again later.",
        organicGuide: {
          preparation: [],
          planting: [],
          maintenance: [],
          harvesting: []
        }
      }];
    }
  } catch (error) {
    console.error('Error in getCropSuggestions:', error);
    throw error;
  }
}

export async function getChatbotResponse(userInput: string, farmData: any | null, imageUrl?: string) {
  try {
    let prompt = `You are a friendly Indian farming expert who speaks in simple, clear language. Your goal is to help farmers understand organic farming methods easily.

When answering questions:
1. Start with "Namaste! 🙏" to make farmers feel welcome
2. Break down complex farming terms into simple words
3. Use short, clear sentences
4. Give practical examples that Indian farmers can relate to
5. Focus only on organic methods - no chemicals
6. End with a simple tip or encouragement

If an image is provided, first analyze it for:
1. Plant health issues
2. Disease symptoms
3. Pest damage
4. Growth problems
Then provide organic solutions.

If farmer mentions a problem:
1. First explain the problem in simple words
2. Then give 2-3 easy organic solutions
3. Tell how to prevent this problem
4. Suggest local materials they can use
5. Add one traditional farming wisdom if relevant

Keep responses friendly but structured like this:
- Problem (if any): [simple explanation]
- Solution steps: [numbered list]
- Prevention: [bullet points]
- Quick tip: [one practical advice]

User question: ${userInput}
${imageUrl ? `Image URL: ${imageUrl}` : ''}`;

    if (farmData) {
      prompt += `\n\nFarmer's details:
- Soil Type: ${farmData.soilType}
- Land Size: ${farmData.landSize} acres
- Location: ${farmData.location}
- Water Available: ${farmData.waterAvailability}
- Previous Crops: ${farmData.previousCrops}
${farmData.issues ? `- Current Problems: ${farmData.issues}` : ''}

Use this information to give personalized advice.`;
    }

    prompt += '\n\nRemember to use simple Indian English and give practical solutions that farmers can easily follow.';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in getChatbotResponse:', error);
    return "Namaste! 🙏 Sorry, I'm having some trouble right now. Please ask your question again in a moment.";
  }
}