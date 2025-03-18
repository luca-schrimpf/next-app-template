import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API Key aus .env
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("Prompt: " + prompt);
    console.log("API Key:", process.env.OPENAI_API_KEY);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json(
      { error: JSON.stringify(error, null, 2) },
      { status: 500 }
    );
  }
}
