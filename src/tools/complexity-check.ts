import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { idtPost } from "../lib/http";
import {
    createCodeModeResponse,
    createCodeModeError,
} from "@bio-mcp/shared/codemode/response";

interface IdtEnv {
    IDT_CLIENT_ID?: string;
    IDT_CLIENT_SECRET?: string;
}

export function registerComplexityCheck(server: McpServer, env?: IdtEnv): void {
    server.registerTool(
        "idt_complexity_check",
        {
            title: "Check DNA Sequence Complexity",
            description:
                "Screen DNA sequences for synthesis complexity and manufacturability issues. Returns complexity scores and flags for repeats, GC content, secondary structure, etc. Requires IDT API credentials.",
            inputSchema: {
                sequences: z
                    .array(
                        z.object({
                            name: z.string().describe("Sequence label"),
                            sequence: z.string().describe("DNA sequence"),
                        }),
                    )
                    .min(1)
                    .max(100)
                    .describe("Array of DNA sequences to screen"),
            },
        },
        async (args, extra) => {
            const runtimeEnv = env || (extra as { env?: IdtEnv })?.env;
            try {
                if (!runtimeEnv?.IDT_CLIENT_ID || !runtimeEnv?.IDT_CLIENT_SECRET) {
                    return createCodeModeError(
                        "AUTH_REQUIRED",
                        "IDT API requires credentials. Set IDT_CLIENT_ID and IDT_CLIENT_SECRET environment variables. Free account at idtdna.com.",
                    );
                }

                const body = {
                    sequences: args.sequences.map((s: { name: string; sequence: string }) => ({
                        Name: s.name,
                        Sequence: s.sequence.replace(/\s/g, ""),
                    })),
                };

                const response = await idtPost("/Complexities/ScreenGBlockSequences", body, {
                    clientId: runtimeEnv.IDT_CLIENT_ID,
                    clientSecret: runtimeEnv.IDT_CLIENT_SECRET,
                });

                if (!response.ok) {
                    const errBody = await response.text().catch(() => "");
                    throw new Error(`IDT API error: HTTP ${response.status}${errBody ? ` - ${errBody.slice(0, 300)}` : ""}`);
                }

                const data = await response.json();

                return createCodeModeResponse(data, {
                    meta: { fetched_at: new Date().toISOString(), sequences_screened: args.sequences.length },
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                return createCodeModeError("API_ERROR", `idt_complexity_check failed: ${msg}`);
            }
        },
    );
}
