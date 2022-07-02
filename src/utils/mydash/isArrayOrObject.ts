import { isArray } from './isArray';
import { isPlainObject } from './isPlainObject';

export function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || isArray(value);
}