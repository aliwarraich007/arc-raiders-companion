import { Href } from "expo-router";
import { ImageURISource } from "react-native";

export type ApiErrorKind =
  | "network" // no connection, DNS failure, TLS failure
  | "timeout" // exceeded timeoutMs
  | "aborted" // cancelled by the caller (e.g. React Query)
  | "http" // non-2xx response
  | "invalid-content" // 2xx but not JSON (HTML page, proxy error, etc.)
  | "parse"; // JSON content-type but body failed to parse

export type Params = Record<
  string,
  string | number | boolean | null | undefined
>;

export type NativeFetchOptions = Omit<RequestInit, "signal"> & {
  signal?: AbortSignal;
  timeoutMs?: number;
  params?: Params;
};

export type HubCardItem = {
  id: string;
  label: string;
  href: Href;
  image: ImageURISource;
};
