
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedContent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    clientEmail: {
      type: Type.OBJECT,
      properties: {
        body: {
          type: Type.STRING,
          description: "The full, plain-text body of the email. Preserve line breaks with \\n. Do not include sign-off or greeting.",
        },
        mailtoLink: {
          type: Type.STRING,
          description: "The fully URL-encoded mailto: link, including recipient (if known), subject, and the generated body. It should be just the URL, not in Markdown format."
        }
      },
      required: ['body', 'mailtoLink']
    },
    crmNotes: {
      type: Type.STRING,
      description: "A single block of text containing concise bullet points for CRM notes. Each bullet point must start with '• '."
    }
  },
  required: ['clientEmail', 'crmNotes']
};

const getPrompt = (transcript: string): string => `
You are an expert assistant for a mortgage broker. Based on the following transcript, generate a client email and internal CRM notes.

Transcript:
---
${transcript}
---

Follow these instructions precisely and provide the output in the requested JSON format.

**Part 1: Client Email**
- Construct a professional email to the client based on the transcript. Give a good summary.
- Start the email with "Hi [name],", where [name] is the client's first name from the transcript.
- Where concepts are mentioned, add links to non-commercial sites like moneyhelper.org.uk, or onlinemortgageadvisor.co.uk but only link externally if concepts are unusually tricky or technical.
- If specific documents or next steps are discussed for the client, you MUST list these in a bulleted list. If none are discussed, do not add this section.
- Do NOT add any sign-off, greeting, or contact information.
- The entire body of the email should be plain text, without any special formatting like bold or italics.
- After you have written the email's body, create a mailto: link.
- The mailto: link must be URL-encoded and contain the recipient's email (if known, otherwise leave blank), a suitable subject line, and the full body of the email.

**Part 2: CRM Notes**
- Summarise the call for a notes box within my CRM.
- The summary must be concise bullet points using '•' as the bullet point character.
- Keep the total length under 1000 characters.
- Use accepted mortgage broker jargon and abbreviations (e.g., LTV, DIP, FTB).
- Do not add headers like "Client Name" or "Date," as this data already exists in the CRM record. Focus only on the key points, actions, and figures from the conversation.
`;


export const generateContentFromTranscript = async (transcript: string): Promise<GeneratedContent> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: getPrompt(transcript),
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedData: GeneratedContent = JSON.parse(jsonText);
    
    // Sanitize the mailto link just in case
    if (parsedData.clientEmail && parsedData.clientEmail.mailtoLink && !parsedData.clientEmail.mailtoLink.startsWith('mailto:')) {
        parsedData.clientEmail.mailtoLink = 'mailto:';
    }

    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating content.");
  }
};
