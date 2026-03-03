import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserById } from "@/lib/users";
import { runFullAnalysis } from "@/lib/analyzer";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyB_rOxxkl_tN00r9mwUlUWYFjJpF9SoCVY"; // Fallback to provided key for demo
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const { userId, scenario } = await req.json()
        const user = getUserById(userId)

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
        }

        const report = runFullAnalysis(user)

        // Check if human escalation is required and no scenario (what-if) is provided
        if (report.humanEscalationRequired && !scenario) {
            // Build a 3-bullet summary for the human advisor
            const esclationGaps = report.gaps.filter(g => g.requiresHumanAdvisor);
            const escalationReasons = esclationGaps.map(g => g.summary).join(' ');

            const preparedSummary = `
- **Client**: ${user.name}, Age ${user.age}, ${user.lifeStage}
- **Issue**: ${escalationReasons}
- **Context**: Portfolio equity weight is ${user.portfolio.currentAllocation.equities}%. Recommended to discuss adjusting risk profile to match pre-retirement timeline.
      `.trim();

            return new Response(JSON.stringify({
                escalate: true,
                reason: report.humanEscalationReason,
                preparedSummary
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // If scenario is provided, append it to the user prompt
        const userPrompt = scenario
            ? buildUserPrompt(report) + `\n\nSCENARIO QUESTION: ${scenario}`
            : buildUserPrompt(report)

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: buildSystemPrompt(),
        });

        const result = await model.generateContentStream(userPrompt);

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    controller.enqueue(encoder.encode(chunk.text()));
                }
                controller.close();
            },
        });

        return new Response(readable, {
            headers: { "Content-Type": "text/plain; charset=utf-8" }
        })
    } catch (error) {
        console.error("Error in advise route:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
    }
}
