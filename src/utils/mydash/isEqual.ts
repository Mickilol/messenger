import { isPlainObject } from './isPlainObject';

export function isEqual(a: PlainObject, b: PlainObject): boolean {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  
  let result = true;
  
  for (let key in a) {
    if (!a.hasOwnProperty(key)) {
      continue;
    }
    
    if (isPlainObject(a[key]) && isPlainObject(b[key])) {
      result = isEqual(a[key] as PlainObject, b[key] as PlainObject);

      if (result === false) {
        return false;
      }
    } else if (a[key] !== b[key]) {
      return false;
    }
  }
  
  return result;
}