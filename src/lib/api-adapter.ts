import type { ApiFetchFn } from "@bio-mcp/shared/codemode/catalog";
import { idtFetch, idtPost } from "./http";

export function createIdtApiFetch(env?: { IDT_CLIENT_ID?: string; IDT_CLIENT_SECRET?: string }): ApiFetchFn {
    return async (request) => {
        const opts = {
            clientId: env?.IDT_CLIENT_ID,
            clientSecret: env?.IDT_CLIENT_SECRET,
        };

        let response: Response;
        if (request.method === "POST") {
            response = await idtPost(request.path, request.body as object, opts);
        } else {
            response = await idtFetch(request.path, request.params, opts);
        }

        if (!response.ok) {
            let errorBody: string;
            try {
                errorBody = await response.text();
            } catch {
                errorBody = response.statusText;
            }
            const error = new Error(`HTTP ${response.status}: ${errorBody.slice(0, 200)}`) as Error & {
                status: number;
                data: unknown;
            };
            error.status = response.status;
            error.data = errorBody;
            throw error;
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("json")) {
            const text = await response.text();
            return { status: response.status, data: text };
        }

        const data = await response.json();
        return { status: response.status, data };
    };
}
