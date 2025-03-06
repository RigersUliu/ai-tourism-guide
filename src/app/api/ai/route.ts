import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const API_KEY = process.env.DEEPSEEK_API_KEY?.trim();
const API_ENDPOINT = process.env.DEEPSEEK_API_URL?.trim();
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID?.trim() || 'deepseek-R1';

interface ApiError extends Error {
  status?: number;
}

interface CityInfo {
  description: string;
  attractions: Array<{
    name: string;
    description: string;
    location?: string;
  }>;
  culture: {
    history: string;
    customs: string;
    food: string;
  };
  practicalInfo: {
    transportation: string;
    accommodation: string;
    emergencyContacts: string;
  };
}

type CitiesData = {
  [key: string]: CityInfo;
};

const cityInfoCache = new Map<string, CityInfo>();
let allCitiesCache: CitiesData | null = null;

async function loadCityInfo(city: string): Promise<CityInfo | null> {
  const cityLower = city.toLowerCase();

  // Check cache first
  const cachedInfo = cityInfoCache.get(cityLower);
  if (cachedInfo) {
    return cachedInfo;
  }

  try {
    // First, try to load from a single cities.json file
    if (!allCitiesCache) {
      try {
        const allCitiesPath = path.join(process.cwd(), 'data', 'cities.json');
        const allCitiesContent = await fs.readFile(allCitiesPath, 'utf-8');
        allCitiesCache = JSON.parse(allCitiesContent) as CitiesData;
      } catch {
        // If cities.json doesn't exist, we'll try individual files
        allCitiesCache = null;
      }
    }

    // If we have all cities data, use it
    if (allCitiesCache && allCitiesCache[cityLower]) {
      cityInfoCache.set(cityLower, allCitiesCache[cityLower]);
      return allCitiesCache[cityLower];
    }

    // If no single file or city not found in it, try individual file
    const filePath = path.join(process.cwd(), 'data', 'cities', `${cityLower}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const cityInfo = JSON.parse(fileContent) as CityInfo;
    
    // Cache the result
    cityInfoCache.set(cityLower, cityInfo);
    return cityInfo;
  } catch {
    console.warn(`No information found for city: ${city}`);
    return null;
  }
}

export async function POST(request: Request) {
  if (!API_KEY || !API_ENDPOINT) {
    console.error('Missing required environment variables:', {
      hasApiKey: !!API_KEY,
      hasApiEndpoint: !!API_ENDPOINT
    });
    return NextResponse.json(
      { error: 'Deepseek API configuration missing. Please check environment variables.' },
      { status: 500 }
    );
  }

  try {
    const { query, city, context } = await request.json();

    if (!query || !city) {
      return NextResponse.json(
        { error: 'Missing required parameters: query and city are required' },
        { status: 400 }
      );
    }

    // Load city-specific information
    const cityInfo = await loadCityInfo(city);
    
    // Create a comprehensive system prompt with city information
    let systemPrompt = `You are an expert AI tour guide for ${city}. Provide direct, concise answers without showing your thinking process or using phrases like "let me tell you about" or "I can help you with". Just give the relevant information directly.`;
    
    if (cityInfo) {
      systemPrompt += `\n\nHere is verified information about ${city}:

Description: ${cityInfo.description}

Key Attractions:
${cityInfo.attractions.map(a => `- ${a.name}: ${a.description}${a.location ? ` (Location: ${a.location})` : ''}`).join('\n')}

Cultural Information:
- History: ${cityInfo.culture.history}
- Customs: ${cityInfo.culture.customs}
- Food: ${cityInfo.culture.food}

Practical Information:
- Transportation: ${cityInfo.practicalInfo.transportation}
- Accommodation: ${cityInfo.practicalInfo.accommodation}
- Emergency Contacts: ${cityInfo.practicalInfo.emergencyContacts}`;
    }

    systemPrompt += `\n\nProvide direct, factual information about the city. If asked about something not covered in the provided information, provide general knowledge while prioritizing the verified information above. Always be concise and avoid meta-commentary.`;

    const aiResponse = await getAIResponse(query, systemPrompt, context);
    return NextResponse.json({ answer: aiResponse });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error('Error processing request:', apiError);
    return NextResponse.json(
      { error: apiError.message || 'Failed to process request' },
      { status: apiError.status || 500 }
    );
  }
}

async function getAIResponse(query: string, systemPrompt: string, context?: string) {
  const requestBody = {
    model: DEPLOYMENT_ID,
    messages: [
      { role: 'system', content: systemPrompt },
      ...(context ? [{ role: 'assistant', content: context }] : []),
      { role: 'user', content: query }
    ],
    temperature: 0.7,
    max_tokens: 800,
    top_p: 0.95
  };

  try {
    console.log('Making request to Deepseek API:', {
      endpoint: `${API_ENDPOINT}/chat/completions`,
      model: DEPLOYMENT_ID,
      messageCount: requestBody.messages.length
    });

    const response = await fetch(`${API_ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('Deepseek API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          url: response.url,
          requestBody
        });
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        console.error('Failed to parse error response');
      }
      const error = new Error(errorMessage) as ApiError;
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid response format from Deepseek API');
    }
    
    console.log('Successfully received response from Deepseek API');
    return data.choices[0].message.content;
  } catch (err: unknown) {
    console.error('Error calling Deepseek API:', err);
    throw err;
  }
}