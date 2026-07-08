import { NextResponse } from 'next/server';
import { rateLimit, getClientIp, safeParseJson } from '@/lib/api-utils';

function isValidReflection(output: string): boolean {
  // P-H-044: removed redundant `output.trim().length < 10` check —
  // the word-count check (>= 15 words) is strictly stronger (15
  // one-letter words = 29 chars minimum).
  if (!output || typeof output !== 'string') return false;

  const words = output.trim().split(/\s+/);
  if (words.length < 15) return false; // Too short to be a 2-4 sentence reflection

  const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return false; // Needs at least 2 sentences

  // Block fabricated-citation indicators. NOTE: the bare word "muslim" was
  // previously in this list, which silently rejected valid reflections
  // containing phrases like "as Muslims, we" (the system prompt explicitly
  // asks for "a daily reflection for a Muslim user"). Now we block only
  // the citation-specific token "sahih muslim" (the hadith collection
  // name), not the bare word. Same for "quran" — only block when it
  // appears as a citation prefix like "quran:".
  // See audit P-H-001.
  const forbiddenWords = [
    'surah',
    'ayah',
    'quran:',
    'bukhari',
    'sahih muslim',
    'tirmidhi',
    'abu dawud',
    'narrated',
    'prophet said',
    'allah says',
  ];
  const lowerOutput = output.toLowerCase();

  if (forbiddenWords.some(word => lowerOutput.includes(word))) {
    return false;
  }

  // Previously: rejected any reflection with >= 2 double-quote characters
  // (i.e. a single quoted phrase). This was far too aggressive — LLMs
  // naturally quote single words like the quality of "sabr" (patience),
  // which is benign. Now: only reject when there are >= 4 double-quote
  // characters (i.e. two separate quoted phrases), which suggests the
  // model is quoting hadith/verse blocks.
  // See audit P-H-002.
  if ((output.match(/"/g) || []).length >= 4) {
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

    // P-H-016: rate limit (10 req/IP/hour — LLM calls are expensive)
    const ip = getClientIp(request);
    if (!rateLimit(ip, 10, 1 / 360)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // P-H-016: body-size cap (4KB max — legitimate requests are < 1KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 4096) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
    }

    // P-H-043: safe JSON parse (returns 400 on malformed, not 500)
    const body = await safeParseJson(request);
    if (body === null) {
      return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
    }
    const { dateStr, contentText, context } = body as {
      dateStr?: string;
      contentText?: string;
      context?: { timeOfDay?: string; isFriday?: unknown; isRamadan?: unknown; weatherCondition?: string };
    };

    if (!dateStr || !contentText) {
      return NextResponse.json({ error: 'dateStr and contentText are required.' }, { status: 400 });
    }

    // P-H-041: validate context shape (whitelist allowed values)
    const VALID_TIME_OF_DAY = ['dawn', 'day', 'golden', 'night'] as const;
    const validTimeOfDay =
      context?.timeOfDay && (VALID_TIME_OF_DAY as readonly string[]).includes(context.timeOfDay)
        ? context.timeOfDay
        : undefined;
    const validIsFriday = context?.isFriday === true;
    const validIsRamadan = context?.isRamadan === true;
    const validWeather =
      typeof context?.weatherCondition === 'string' && context.weatherCondition.length <= 32
        ? context.weatherCondition
        : undefined;

    let contextualInstruction = "Keep it contemplative and rooted in daily life.";
    if (context) {
      const parts = [];
      if (validIsFriday) parts.push("a Friday (Jumu'ah) tone, emphasizing community, blessings, or spiritual reset");
      if (validIsRamadan) parts.push("a Ramadan awareness, focusing on fasting, patience, or the Quran");

      if (validTimeOfDay === 'dawn' || validTimeOfDay === 'day') parts.push("a morning/daytime feel (fresh starts, seeking provision, energy)");
      else if (validTimeOfDay === 'golden') parts.push("a sunset/Maghrib tone (gratitude, winding down, transition)");
      else if (validTimeOfDay === 'night') parts.push("a nighttime tone (tranquility, seeking forgiveness, rest)");

      if (validWeather === 'Rain') parts.push("a subtle rain theme (mercy, growth, washing away)");
      else if (validWeather === 'Clear') parts.push("a clear weather theme (clarity, brightness, light)");

      if (parts.length > 0) {
        contextualInstruction = "Infuse the reflection subtly with " + parts.join(", ") + ". Do NOT mention these contexts explicitly as variables, just naturally weave their themes in.";
      }
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
4. ${contextualInstruction}`;

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
