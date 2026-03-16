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

export function registerCodonOptimize(server: McpServer, env?: IdtEnv) {
    server.registerTool(
        "idt_codon_optimize",
        {
            title: "Codon Optimize a Protein Sequence",
            description:
                "Submit a protein sequence for codon optimization targeting a specific organism. Returns an optimized DNA sequence. Requires IDT API credentials (IDT_CLIENT_ID + IDT_CLIENT_SECRET).",
            inputSchema: {
                protein_sequence: z
                    .string()
                    .min(1)
                    .describe("Protein sequence (single-letter amino acid codes, e.g. 'MSKGEELFTG...')"),
                organism: z
                    .string()
                    .min(1)
                    .describe("Target organism for optimization (e.g. 'Homo sapiens', 'Escherichia coli K12')"),
                name: z
                    .string()
                    .default("sequence")
                    .optional()
                    .describe("Name/label for the sequence (default: 'sequence')"),
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
                    proteinSequences: [
                        {
                            Name: args.name || "sequence",
                            Sequence: String(args.protein_sequence).replace(/\s/g, ""),
                        },
                    ],
                    organism: String(args.organism),
                };

                const response = await idtPost("/CodonOpt/Optimize", body, {
                    clientId: runtimeEnv.IDT_CLIENT_ID,
                    clientSecret: runtimeEnv.IDT_CLIENT_SECRET,
                });

                if (!response.ok) {
                    const errBody = await response.text().catch(() => "");
                    throw new Error(`IDT API error: HTTP ${response.status}${errBody ? ` - ${errBody.slice(0, 300)}` : ""}`);
                }

                const data = await response.json();

                return createCodeModeResponse(data, {
                    meta: { fetched_at: new Date().toISOString(), organism: String(args.organism) },
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                return createCodeModeError("API_ERROR", `idt_codon_optimize failed: ${msg}`);
            }
        },
    );
}
