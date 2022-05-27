export function range(startElem, endElem, stepElem) {
  const result = [];
  
  const start = endElem ? (startElem || 0) : 0;
  const end = endElem || startElem;
  const step = stepElem || (end < 0 ? -1 : 1);
  
  const arrayLength = Math.abs((end - start) / (step || 1));
  
  for (let i = 0, elem = start; i < arrayLength; i++, elem = elem + step) {
    result.push(elem);
  }
  
  return result;
}