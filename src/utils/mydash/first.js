export function first(list) {
  if (!Array.isArray(list)) {
    return undefined;
  }
  
  return list[0];	
}