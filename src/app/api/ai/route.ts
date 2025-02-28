import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { query } = await request.json();

  const aiResponse = await getAIResponse(query);

  return NextResponse.json({ answer: aiResponse });
}

async function getAIResponse(query: string) {
  return `Here’s some information about ${query}.`; // !Replace with actual API call to DeepSeek
}
