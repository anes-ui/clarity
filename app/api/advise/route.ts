import Anthropic from "@anthropic-ai/sdk"
import { getUserById } from "@/lib/users"
import { runFullAnalysis } from "@/lib/analyzer"
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

        const stream = await client.messages.stream({
            model: "claude-3-5-sonnet-20241022", // Using an actual available model based on the requested format
            max_tokens: 1500,
            system: buildSystemPrompt(),
            messages: [{ role: "user", content: userPrompt }],
        })

        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                        controller.enqueue(encoder.encode(chunk.delta.text))
                    }
                }
                controller.close()
            },
        })

        return new Response(readable, {
            headers: { "Content-Type": "text/plain; charset=utf-8" }
        })
    } catch (error) {
        console.error("Error in advise route:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
    }
}
