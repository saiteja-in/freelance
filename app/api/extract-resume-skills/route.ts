import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxRetries: 2,
});

const extractSkillsTemplate = `
You are a resume parsing engine. Your task is to extract a list of skills from the resume provided below. The resume data is enclosed within the delimiters. Analyze the resume and return only a JSON object with a single key "skills" whose value is an array of all the skills you can identify.

*** RESUME DATA STARTS ***
{resume}
*** RESUME DATA ENDS ***

Make sure your output is a valid JSON object and does not contain any additional text or formatting.
`;

export async function POST(req: NextRequest) {
  try {
    const { extractedText } = await req.json();
    console.log("extractedText", extractedText);
    if (!extractedText) {
      return NextResponse.json(
        { error: "Missing required resume data" },
        { status: 400 }
      );
    }

    const extractSkillsPrompt = PromptTemplate.fromTemplate(
      extractSkillsTemplate
    );
    console.log("extractSkillsPrompt", extractSkillsPrompt);
    const extractChain = extractSkillsPrompt.pipe(llm);
    console.log("extractChain", extractChain);
    const result = await extractChain.invoke({ resume: extractedText });
    console.log("result", result);

    const cleanResponse = result.lc_kwargs.content
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "");
    console.log("cleanResponse", cleanResponse);

    const parsedData = JSON.parse(cleanResponse);
    console.log("parsedData", parsedData);

    return NextResponse.json({ skills: parsedData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to process resume",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
