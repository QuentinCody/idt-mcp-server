import { RestStagingDO } from "@bio-mcp/shared/staging/rest-staging-do";
import type { SchemaHints } from "@bio-mcp/shared/staging/schema-inference";

export class IdtDataDO extends RestStagingDO {
    protected getSchemaHints(data: unknown): SchemaHints | undefined {
        if (!data || typeof data !== "object") return undefined;

        if (Array.isArray(data)) {
            const sample = data[0];
            if (sample && typeof sample === "object") {
                if ("OptimizedSequence" in sample || "optimizedSequence" in sample) {
                    return {
                        tableName: "optimization_results",
                        indexes: ["InputName", "Organism"],
                    };
                }
            }
        }

        const obj = data as Record<string, unknown>;
        if (obj.OptimizedSequence || obj.optimizedSequence) {
            return {
                tableName: "optimization_results",
            };
        }

        return undefined;
    }
}
