export function last(list: unknown[]): unknown {
  if (!Array.isArray(list)) {
    return undefined;
  }
  
  return list[list.length - 1];
}