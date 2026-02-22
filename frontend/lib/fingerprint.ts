import crypto from "crypto";

export function fingerprintError(message: string, stack?: string) {
  const base = message + (stack?.split("\n").slice(0, 3).join("") || "");
  return crypto.createHash("sha256").update(base).digest("hex");
}
