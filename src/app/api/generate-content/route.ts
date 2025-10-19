import { NextRequest, NextResponse } from 'next/server';

interface GenerateContentRequest {
  userPrompt: string;
  language: 'uzbek' | 'russian';
  documentType: string;
  formData: Record<string, string | boolean>;
  aiSections: Array<{
    id: string;
    label: { uzbek: string; russian: string };
    section_number: string;
    description: { uzbek: string; russian: string };
    prompt_guidance: string;
  }>;
}

interface SectionContent {
  heading: string;
  content: string;
  bulletPoints: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateContentRequest = await request.json();
    const { userPrompt, language, documentType, formData, aiSections } = body;

    console.log('[API] Received request:', { language, documentType, sectionsCount: aiSections?.length });

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('[API] OpenAI API key not found in environment');
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    console.log('[API] OpenAI API key found, proceeding with generation');

    // Build the system prompt
    const systemPrompt = `You are a professional legal document generator for Uzbekistan. Generate legally sound, professional content in ${language === 'uzbek' ? 'Uzbek' : 'Russian'} language ONLY.

IMPORTANT RULES:
1. Generate content ONLY in ${language === 'uzbek' ? 'Uzbek' : 'Russian'} language
2. Use formal legal terminology
3. Include specific numbered clauses (e.g., 3.1, 3.2, 3.3)
4. Be comprehensive and detailed
5. Return ONLY valid JSON, no other text

User's form data:
${Object.entries(formData)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Return JSON in this EXACT format (use the section IDs provided in the user message):
{
  "sections": {
    "ai_section_rights_obligations": {
      "content": "3.1. First clause text here...<br/><br/>3.2. Second clause text here...<br/><br/>3.3. Third clause..."
    },
    "ai_section_liability": {
      "content": "4.1. First clause text here...<br/><br/>4.2. Second clause text here..."
    }
  }
}

For each clause:
- Start with clause number (e.g., 3.1, 3.2)
- Write 2-3 detailed sentences
- Separate clauses with <br/><br/>
- Use ONLY ${language === 'uzbek' ? 'Uzbek' : 'Russian'} language
- Be specific and reference the user's data where relevant`;

    // Build user prompt with section details
    const userMessage = `${userPrompt}\n\nGenerate content for these sections. USE THE EXACT SECTION IDs PROVIDED:\n${aiSections
      .map(
        (section) =>
          `\nSection ID: "${section.id}"\nSection Number: ${section.section_number}\nTitle: ${section.label[language]}\nDescription: ${section.description[language]}\nGuidance: ${section.prompt_guidance}`
      )
      .join('\n')}\n\nIMPORTANT: In your JSON response, use the exact Section IDs I provided above (e.g., "${aiSections[0]?.id}"). Do NOT use generic IDs like "section_3".`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[API] OpenAI API error:', response.status, error);
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status} - ${error.substring(0, 200)}` },
        { status: 500 }
      );
    }

    console.log('[API] OpenAI API call successful');

    const data = await response.json();
    const rawContent = data.choices[0].message.content;

    console.log('OpenAI raw response:', rawContent);

    const generatedContent = JSON.parse(rawContent);

    console.log('Parsed content:', JSON.stringify(generatedContent, null, 2));

    // Process and format the sections for the template
    const formattedSections: Record<string, { content: string }> = {};

    if (generatedContent.sections) {
      Object.keys(generatedContent.sections).forEach((sectionId) => {
        const section = generatedContent.sections[sectionId];
        const aiSection = aiSections.find(s => s.id === sectionId);

        if (aiSection) {
          // Format the content with proper HTML structure
          const sectionTitle = aiSection.label[language];
          const sectionNumber = aiSection.section_number;

          const formattedContent = `
            <h2 class="article-title">
              ${sectionNumber}. ${sectionTitle.toUpperCase()}
            </h2>
            <p class="article-content">
              ${section.content}
            </p>
          `.trim();

          formattedSections[sectionId] = { content: formattedContent };
        }
      });
    }

    console.log('[API] Formatted sections:', Object.keys(formattedSections));
    console.log('[API] Returning successful response');

    return NextResponse.json({ sections: formattedSections });
  } catch (error) {
    console.error('[API] Error generating content:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
