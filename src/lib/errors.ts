export function getErrorMessage(error: unknown, fallback = "操作失败，请稍后重试") {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const message = record.message ?? record.msg ?? record.error_description ?? record.error;

    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}
