import { ApiErrorKind } from "../types";

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
