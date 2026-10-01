function format(message: string, args: unknown[]): string {
  let index = 0;
  return message.replace(/%s/g, () => String(args[index++]));
}

export default function invariant(condition: unknown, message: string, ...args: unknown[]): asserts condition {
  if (!condition) {
    const error = new Error(format(message, args));
    error.name = "Invariant Violation";
    throw error;
  }
}
