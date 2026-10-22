import { NativeFetchOptions, Params } from "../types";
import { ApiError } from "./api-error";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_TIMEOUT_MS = 15_000;

/* ---------- 1. URL ---------- */

const buildUrl = (endpoint: string, params?: Params) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value != null) query.append(key, String(value));
  }
  const qs = query.toString();
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${API_URL}${endpoint}${qs ? separator + qs : ""}`;
};

/* ---------- 2. Timeout + cancellation ---------- */

const createRequestSignal = (
  external: AbortSignal | undefined,
  timeoutMs: number,
) => {
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onAbort = () => controller.abort();
  if (external?.aborted)
    controller.abort(); // If it’s already aborted when you start, abort immediately.
  else external?.addEventListener("abort", onAbort); // Otherwise, listen for it to abort later, and forward that to your controller.

  return {
    signal: controller.signal,
    wasTimedOut: () => timedOut,
    wasCancelled: () => external?.aborted === true,
    cleanup: () => {
      clearTimeout(timeoutId);
      external?.removeEventListener("abort", onAbort);
    },
  };
};

/* ---------- 3. Response handling (throws ApiError, never catches) ---------- */

const extractMessage = (text: string): string | undefined => {
  try {
    const data = JSON.parse(text);
    return data?.message ?? data?.error;
  } catch {
    return undefined;
  }
};

const parseResponse = <T>(response: Response, text: string, url: string): T => {
  const { status, statusText } = response;

  if (!response.ok) {
    throw new ApiError(
      "http",
      extractMessage(text) ?? `HTTP ${status} ${statusText}`.trim(),
      { url, status, body: text.slice(0, 500) },
    );
  }

  if (status === 204 || text.length === 0) return undefined as T;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    throw new ApiError(
      "invalid-content",
      `Expected JSON but received "${contentType || "unknown"}"`,
      {
        url,
        status,
        body: text.slice(0, 200),
      },
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError("parse", "Response was not valid JSON", {
      url,
      status,
      body: text.slice(0, 200),
    });
  }
};

/* ---------- 4. One place that classifies unexpected errors ---------- */

const toApiError = (
  err: unknown,
  url: string,
  req: ReturnType<typeof createRequestSignal>,
  timeoutMs: number,
): ApiError => {
  if (err instanceof ApiError) return err; // already classified by parseResponse
  if (req.wasTimedOut()) {
    return new ApiError("timeout", `Request timed out after ${timeoutMs}ms`, {
      url,
    });
  }
  if (req.wasCancelled() || (err as Error)?.name === "AbortError") {
    return new ApiError("aborted", "Request was cancelled", { url });
  }
  return new ApiError(
    "network",
    "Network request failed. Check your connection.",
    { url },
  );
};

/* ---------- 5. Public function ---------- */

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
  const req = createRequestSignal(signal, timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...headers },
      signal: req.signal,
    });
    const text = await response.text();
    console.log(text, "RESPONSE");
    return parseResponse<T>(response, text, url);
  } catch (err) {
    throw toApiError(err, url, req, timeoutMs);
  } finally {
    req.cleanup();
  }
};
