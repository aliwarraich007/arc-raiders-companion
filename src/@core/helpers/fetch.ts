// api/native-fetch.ts
const API_URL = process.env.API_URL; // verify against their docs
const DEFAULT_TIMEOUT_MS = 15_000;

export type ApiErrorKind =
  | "network" // no connection, DNS failure, TLS failure
  | "timeout" // exceeded timeoutMs
  | "aborted" // cancelled by the caller (e.g. React Query)
  | "http" // non-2xx response
  | "invalid-content" // 2xx but not JSON (HTML page, proxy error, etc.)
  | "parse"; // JSON content-type but body failed to parse

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly url: string;
  readonly status?: number;
  readonly body?: string;

  constructor(
    kind: ApiErrorKind,
    message: string,
    details: { url: string; status?: number; body?: string },
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = "ApiError";
    this.kind = kind;
    this.url = details.url;
    this.status = details.status;
    this.body = details.body;
  }
}

type Params = Record<string, string | number | boolean | null | undefined>;

export type NativeFetchOptions = Omit<RequestInit, "signal"> & {
  signal?: AbortSignal;
  timeoutMs?: number;
  params?: Params;
};

const buildUrl = (endpoint: string, params?: Params) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null) query.append(key, String(value));
  }
  const qs = query.toString();
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${API_URL}${endpoint}${qs ? separator + qs : ""}`;
};

const extractMessage = (text: string): string | undefined => {
  try {
    const data = JSON.parse(text);
    return data?.message ?? data?.error ?? undefined;
  } catch {
    return undefined;
  }
};

export const nativeFetch = async <T>(
  endpoint: string,
  {
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    params,
    headers,
    ...init
  }: NativeFetchOptions = {},
): Promise<T> => {
  if (!endpoint.startsWith("/")) {
    throw new Error(`Endpoint must start with "/": received "${endpoint}"`);
  }

  const url = buildUrl(endpoint, params);

  // One controller handles both the timeout and the caller's cancellation.
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => controller.abort();

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onExternalAbort);
  }

  try {
    let response: Response;
    try {
      response = await fetch(url, {
        ...init,
        headers: { Accept: "application/json", ...headers },
        signal: controller.signal,
      });
    } catch (err) {
      if (timedOut) {
        throw new ApiError(
          "timeout",
          `Request timed out after ${timeoutMs}ms`,
          { url },
        );
      }
      if (signal?.aborted || (err as Error)?.name === "AbortError") {
        throw new ApiError("aborted", "Request was cancelled", { url });
      }
      throw new ApiError(
        "network",
        "Network request failed. Check your connection.",
        { url },
      );
    }

    // Read the body as text once; parse it ourselves so failures are explicit.
    let text: string;
    try {
      text = await response.text();
    } catch {
      if (timedOut) {
        throw new ApiError(
          "timeout",
          `Request timed out after ${timeoutMs}ms`,
          { url },
        );
      }
      throw new ApiError("network", "Failed to read response body", {
        url,
        status: response.status,
      });
    }

    if (!response.ok) {
      const message =
        extractMessage(text) ??
        `HTTP ${response.status} ${response.statusText}`.trim();
      throw new ApiError("http", message, {
        url,
        status: response.status,
        body: text.slice(0, 500),
      });
    }

    if (response.status === 204 || text.length === 0) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("json")) {
      throw new ApiError(
        "invalid-content",
        `Expected JSON but received "${contentType || "unknown"}"`,
        { url, status: response.status, body: text.slice(0, 200) },
      );
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError("parse", "Response was not valid JSON", {
        url,
        status: response.status,
        body: text.slice(0, 200),
      });
    }
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", onExternalAbort);
  }
};
