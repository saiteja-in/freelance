import { commitmentFilterItems } from "@/app/_components/JobFilter";
import { currentUser } from "@/lib/auth";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextRequest, NextResponse } from "next/server";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxRetries: 2,
});

const clientPrompt = `
You are an AI that extracts search criteria for personalized freelancers from a client's natural language input.

Client Input:
{clientInput}

The client may specify the following parameters:
- "budget": a numeric range with a lower and upper limit.
- "rating": a numeric range with a lower and upper limit.
- "experience": a numeric range with a lower and upper limit.
- "languages_known": a list of languages (strings).
- "skills": a list of relevant freelancer skills (strings).

Return a JSON object in the following **exact structure**:

{{ 
  "budget": {{ "min": <number>, "max": <number> }},
  "rating": {{ "min": <floating number>, "max": <number> }},
  "experience": {{ "min": <number>, "max": <number> }},
  "languages_known": [<string>, ...] or null,
  "skills": [<string>, ...] or null
}}

### Rules:
- If only **min** is provided for budget, default max to **999999**.
- If only **max** is provided for budget, default min to **0**.
- If only **min** is provided for rating, default max to **5**.
- If only **max** is provided for rating, default min to **0**.
- If only **min** is provided for experience, default max to **15**.
- If only **max** is provided for experience, default min to **0**.
- **Do not use the same value for min and max** unless the client explicitly mentions both as the same value.
- If the client does not mention languages, return null for languages_known.
- If the client does not mention any skills, return null for skills.
- If the input is irrelevant or no criteria are specified, return the following exact JSON:

{{ 
  "budget": null,
  "rating": null,
  "experience": null,
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

    const prompt = PromptTemplate.fromTemplate(clientPrompt);
    const filterChain = prompt.pipe(llm);

    const result = await filterChain.invoke({ clientInput: searchPrompt });

    const cleanResponse = result.lc_kwargs.content
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "");
    console.log("cleanResponse", cleanResponse);

    const parsedData = JSON.parse(cleanResponse);
    console.log(parsedData)

    // return NextResponse.json(parsedData, { status: 200 });

    // Build query parameters for the URL
    const params = new URLSearchParams();

    if (parsedData.skills && Array.isArray(parsedData.skills)) {
      parsedData.skills.forEach((skill: string) => {
        params.append("skills", skill);
      });
    }

    if (parsedData.budget) {
      params.append("pay", `${parsedData.budget.min}-${parsedData.budget.max}`);
    }

    if (parsedData.experience) {
      params.append(
        "exp",
        `${parsedData.experience.min}-${parsedData.experience.max} YOE`
      );
    }

    // Check for commitment keywords in the client input
    // const commitment = commitmentFilterItems.find((item) =>
    //   searchPrompt.toUpperCase().includes(item)
    // );
    // if (commitment) {
    //   params.append("commitment", commitment);
    // }

    const url = `http://localhost:3000/find-jobs?${params.toString()}`;

    console.log("printinnnnnnnnnng urll",url)

    return NextResponse.json({ url }, { status: 200 });
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
