export function omit<T extends PlainObject, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
  [K2 in Exclude<keyof T, K[number]>]: T[K2]
} {
  const newObj = {} as {
    [K3 in keyof typeof obj]: (typeof obj)[K3]
  };
  let key: keyof typeof obj;
  
  for (key in obj) {
    if (!(keys.includes(key))) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}