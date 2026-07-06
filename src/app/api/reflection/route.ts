import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    const body = await request.json();
    const { dateStr } = body;

    if (!dateStr) {
      return NextResponse.json({ error: 'dateStr is required.' }, { status: 400 });
    }

    const prompt = `Write a short (2-4 sentence), warm, non-preachy daily reflection for a Muslim user. Reference the current date (${dateStr}). Do not claim religious authority or issue rulings. Keep it uplifting and contemplative.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API Error:', await response.text());
      return NextResponse.json({ error: 'Failed to generate reflection.' }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return NextResponse.json({ error: 'Malformed or empty response from Gemini.' }, { status: 500 });
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error('Reflection API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
