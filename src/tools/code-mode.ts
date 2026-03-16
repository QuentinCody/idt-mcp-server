import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createSearchTool } from "@bio-mcp/shared/codemode/search-tool";
import { createExecuteTool } from "@bio-mcp/shared/codemode/execute-tool";
import { idtCatalog } from "../spec/catalog";
import { createIdtApiFetch } from "../lib/api-adapter";

interface CodeModeEnv {
    IDT_DATA_DO: DurableObjectNamespace;
    CODE_MODE_LOADER: WorkerLoader;
    IDT_CLIENT_ID?: string;
    IDT_CLIENT_SECRET?: string;
}

export function registerCodeMode(
    server: McpServer,
    env: CodeModeEnv,
) {
    const apiFetch = createIdtApiFetch(env);

    const searchTool = createSearchTool({
        prefix: "idt",
        catalog: idtCatalog,
    });
    searchTool.register(server as unknown as { tool: (...args: unknown[]) => void });

    const executeTool = createExecuteTool({
        prefix: "idt",
        catalog: idtCatalog,
        apiFetch,
        doNamespace: env.IDT_DATA_DO,
        loader: env.CODE_MODE_LOADER,
    });
    executeTool.register(server as unknown as { tool: (...args: unknown[]) => void });
}
