// app/api/upload-resume/route.ts
import { currentUser } from "@/lib/auth";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextRequest, NextResponse } from "next/server";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxRetries: 2,
});

const freelancerPrompt = `
You are an AI that extracts search criteria for personalized clients from a freelancer's natural language input.

Freelancer Input:
{clientInput}

The freelancer may specify the following parameters:
- "budget": a numeric range with a lower and upper limit they expect from the client.
- "rating": a numeric range with a lower and upper limit they expect from the client.
- "languages_known": a list of languages the client should speak (strings).
- "skills": a list of required skills the client should be looking for (strings).

Return a JSON object in the following **exact structure**:

{{ 
  "budget": {{ "min": <number>, "max": <number> }},
  "rating": {{ "min": <floating number>, "max": <floating number> }},
  "languages_known": [<string>, ...] or null,
  "skills": [<string>, ...] or null
}}

### Rules:
- If only **min** is provided for budget, default max to **999999**.
- If only **max** is provided for budget, default min to **0**.
- If only **min** is provided for rating, default max to **5**.
- If only **max** is provided for rating, default min to **0**.
- **Do not use the same value for min and max** unless the freelancer explicitly mentions both as the same value.
- If the freelancer does not mention languages, return \`null\` for \`languages_known\`.
- If the freelancer does not mention any skills, return \`null\` for \`skills\`.
- If the input is irrelevant or no criteria are specified, return the following exact JSON:

{{ 
  "budget": null,
  "rating": null,
  "languages_known": null,
  "skills": null
}}

## IMPORTANT: Output must be valid JSON and contain nothing else.
`;

export async function POST(req: NextRequest) {
  try {
    // const user = await currentUser();
    // if (!user) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }

    const { searchPrompt } = await req.json();

    if (!searchPrompt) {
      return NextResponse.json(
        { error: "Missing required search data" },
        { status: 400 }
      );
    }

    const prompt = PromptTemplate.fromTemplate(freelancerPrompt);
    const filterChain = prompt.pipe(llm);

    const result = await filterChain.invoke({ clientInput: searchPrompt });

    const cleanResponse = result.lc_kwargs.content
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "");
    console.log("cleanResponse", cleanResponse);

    const parsedData = JSON.parse(cleanResponse);

    // Return success response
    return NextResponse.json({
      success: true,
      filters: parsedData,
    });
  } catch (error) {
    console.error("Failed to get personalised jobs:", error);
    return NextResponse.json(
      {
        error: "Failed to get personalised jobs",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
