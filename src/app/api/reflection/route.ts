import { NextResponse } from 'next/server';

function isValidReflection(output: string): boolean {
  if (!output || typeof output !== 'string' || output.trim().length < 10) return false;
  
  const words = output.trim().split(/\s+/);
  if (words.length < 15) return false; // Too short to be a 2-4 sentence reflection

  const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return false; // Needs at least 2 sentences

  const forbiddenWords = ['surah', 'ayah', 'bukhari', 'muslim', 'tirmidhi', 'narrated', 'prophet said', 'allah says'];
  const lowerOutput = output.toLowerCase();
  
  if (forbiddenWords.some(word => lowerOutput.includes(word))) {
    return false;
  }
  
  if ((output.match(/"/g) || []).length >= 2) {
    return false;
  }
  
  return true;
}

async function generateWithGemini(prompt: string, apiKey: string): Promise<string> {
  // TEST FLAG: Force Gemini to fail so we can verify the Groq fallback works
  if (process.env.FORCE_GEMINI_FAILURE === 'true') {
    throw new Error('TESTING: Forced Gemini failure via FORCE_GEMINI_FAILURE=true');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${await response.text()}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || '';
}

async function generateWithGroq(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API Error: ${await response.text()}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  return text || '';
}

export async function POST(request: Request) {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    
    if (!geminiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    const body = await request.json();
    const { dateStr, contentText } = body;

    if (!dateStr || !contentText) {
      return NextResponse.json({ error: 'dateStr and contentText are required.' }, { status: 400 });
    }

    const prompt = `Write a short (2-4 sentence), warm, non-preachy daily reflection for a Muslim user.
Connect your reflection to the following daily spiritual content:
"""
${contentText}
"""

CRITICAL RULES:
1. You MUST NOT invent, generate, or paraphrase any Quranic verses or Hadiths yourself.
2. You MUST NOT include any citations (e.g., "Quran 2:10", "Bukhari", etc.) in your output.
3. You are merely offering a brief, uplifting personal reflection on the provided text, without issuing religious rulings.
4. Keep it contemplative and rooted in daily life.`;

    let finalOutput = '';

    // Primary: Gemini
    try {
      const geminiText = await generateWithGemini(prompt, geminiKey);
      const output = geminiText.trim();
      
      if (isValidReflection(output)) {
        finalOutput = output;
        console.log('Reflection generated using Gemini.');
      } else {
        console.warn('Gemini response failed validation:', output);
      }
    } catch (err) {
      console.warn('Gemini generation failed:', err);
    }

    // Fallback: Groq
    if (!finalOutput && groqKey) {
      console.log('Falling back to Groq for reflection generation...');
      try {
        const groqText = await generateWithGroq(prompt, groqKey);
        const output = groqText.trim();
        
        if (isValidReflection(output)) {
          finalOutput = output;
          console.log('Reflection generated using Groq.');
        } else {
          console.warn('Groq response failed validation:', output);
        }
      } catch (err) {
        console.error('Groq generation failed:', err);
      }
    }

    if (!finalOutput) {
      return NextResponse.json({ error: 'All providers failed or returned invalid responses.' }, { status: 500 });
    }

    return NextResponse.json({ text: finalOutput });
  } catch (error) {
    console.error('Reflection API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
