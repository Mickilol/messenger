import { isArrayOrObject } from './isArrayOrObject';

export function cloneDeep(obj: PlainObject) {
  const newObj: PlainObject = Array.isArray(obj) ? [] : {};

  Object.keys(obj).forEach(key => {
    if (isArrayOrObject(obj[key])) {
      newObj[key] = cloneDeep(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}