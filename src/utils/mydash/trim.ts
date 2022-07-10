export function trim(str: string, symbol?: string): string {
  if (!symbol) {
    return str.replace(/(^\s+|\s+$)/g, '');
  } else {
    const regexp = new RegExp(`(^[${symbol}]+|[${symbol}]+$)`, 'g');
    return str.replace(regexp, '');
  }
}