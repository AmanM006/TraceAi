export function normalizeMessage(message: string) {
    return message
      .replace(/\b\d+\b/g, "<NUMBER>")
      .replace(
        /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
        "<UUID>"
      );
  }
  
export function normalizeStack(stack?: string | null) {
    if (!stack) return undefined;
  
    return stack
      .split("\n")
      .slice(0, 5) // only top frames matter
      .map(line =>
        line
          .replace(/:\d+:\d+/g, "") // remove :line:column
          .replace(/\(.*\/(.*)\)/, "($1)") // strip full paths
      )
      .join("\n");
  }
  