export function merge(lhs: PlainObject, rhs: PlainObject): PlainObject {
  const result: PlainObject = {};
  
  Object.keys(lhs).forEach(key => {
    if (typeof lhs[key] === 'object' && lhs[key] !== null) {
      if (key in rhs) {
        result[key] = merge(lhs[key] as PlainObject, rhs[key] as PlainObject);
      } else {
        result[key] = lhs[key];
      }
    } else {
      result[key] = lhs[key];
    }
  });
  
  Object.keys(rhs).filter(key => !(key in lhs)).forEach(key => {
    result[key] = rhs[key];
  });
  
  return result;
}