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

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build the system prompt
    const systemPrompt = `You are a legal document generator for Uzbekistan. Generate professional, legally sound content in ${language === 'uzbek' ? 'Uzbek' : 'Russian'} language.

Document Type: ${documentType}
Language: ${language === 'uzbek' ? 'Uzbek' : 'Russian'}

User has provided the following information:
${Object.entries(formData)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Generate content for the following sections. Each section should be comprehensive, professional, and appropriate for a legal document in Uzbekistan.

For each section, provide:
1. A proper heading (use the section number provided)
2. Multiple numbered clauses/bullet points (e.g., 3.1, 3.2, 3.3, etc.)
3. Use formal legal language appropriate for ${language === 'uzbek' ? 'Uzbek' : 'Russian'}

Return the response in JSON format with this structure:
{
  "sections": {
    "section_id": {
      "heading": "Section heading in ${language === 'uzbek' ? 'Uzbek' : 'Russian'}",
      "content": "Full HTML content for the section with proper formatting",
      "bulletPoints": ["Point 1", "Point 2", "Point 3"]
    }
  }
}

Use HTML tags for formatting: <p>, <strong>, <ul>, <li>, etc.
Ensure all content is in ${language === 'uzbek' ? 'Uzbek' : 'Russian'} language.`;

    // Build user prompt with section details
    const userMessage = `${userPrompt}\n\nGenerate content for these sections:\n${aiSections
      .map(
        (section) =>
          `\nSection ${section.section_number}: ${section.label[language]}\nDescription: ${section.description[language]}\nGuidance: ${section.prompt_guidance}`
      )
      .join('\n')}`;

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
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate content from OpenAI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
