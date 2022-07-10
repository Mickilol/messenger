export function queryStringify(data: Record<string, any>, dataKey?: string): string | never {
  const result: string[] = [];
  
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'object' && data[key] !== null) {
      result.push(queryStringify(data[key], dataKey ? `${dataKey}[${key}]` : key));
    } else {
      result.push(dataKey ? `${dataKey}[${key}]=${data[key]}` : `${key}=${data[key]}`);
    }
  });
  
  return result.join('&');
}