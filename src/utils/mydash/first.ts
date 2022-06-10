export function first(list: unknown[]): unknown {
  if (!Array.isArray(list)) {
    return undefined;
  }
  
  return list[0];	
}