import { restFetch } from "@bio-mcp/shared/http/rest-fetch";
import type { RestFetchOptions } from "@bio-mcp/shared/http/rest-fetch";

const IDT_BASE = "https://www.idtdna.com/api/v1";
const IDT_TOKEN_URL = "https://www.idtdna.com/Identityserver/connect/token";

let cachedToken: { token: string; expiresAt: number } | null = null;

export interface IdtFetchOptions extends Omit<RestFetchOptions, "retryOn"> {
    clientId?: string;
    clientSecret?: string;
}

/**
 * Get an OAuth2 access token using client credentials flow.
 */
async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
    if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
        return cachedToken.token;
    }

    const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "codonopt complexityscores",
    });

    const response = await fetch(IDT_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!response.ok) {
        throw new Error(`IDT OAuth error: HTTP ${response.status} - ${await response.text().catch(() => "")}`);
    }

    const json = await response.json() as { access_token: string; expires_in: number };
    cachedToken = {
        token: json.access_token,
        expiresAt: Date.now() + json.expires_in * 1000,
    };
    return cachedToken.token;
}

/**
 * Fetch from the IDT SciTools API with OAuth2 authentication.
 */
export async function idtFetch(
    path: string,
    params?: Record<string, unknown>,
    opts?: IdtFetchOptions,
): Promise<Response> {
    const headers: Record<string, string> = {
        Accept: "application/json",
        ...(opts?.headers ?? {}),
    };

    if (opts?.clientId && opts?.clientSecret) {
        const token = await getAccessToken(opts.clientId, opts.clientSecret);
        headers.Authorization = `Bearer ${token}`;
    }

    return restFetch(IDT_BASE, path, params, {
        ...opts,
        headers,
        retryOn: [429, 500, 502, 503],
        retries: opts?.retries ?? 3,
        timeout: opts?.timeout ?? 30_000,
        userAgent: "idt-mcp-server/1.0 (bio-mcp)",
    });
}

/**
 * POST to the IDT SciTools API with OAuth2 authentication.
 */
export async function idtPost(
    path: string,
    body: object,
    opts?: IdtFetchOptions,
): Promise<Response> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(opts?.headers ?? {}),
    };

    if (opts?.clientId && opts?.clientSecret) {
        const token = await getAccessToken(opts.clientId, opts.clientSecret);
        headers.Authorization = `Bearer ${token}`;
    }

    return restFetch(IDT_BASE, path, undefined, {
        ...opts,
        method: "POST",
        headers,
        body,
        retryOn: [429, 500, 502, 503],
        retries: opts?.retries ?? 3,
        timeout: opts?.timeout ?? 60_000,
        userAgent: "idt-mcp-server/1.0 (bio-mcp)",
    });
}
