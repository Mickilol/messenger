import { queryStringify } from './queryStringify';

describe('utils/myDash/queryStringify', () => {
  it('should stringify object, array and primitives', () => {
    expect(queryStringify({ obj: { a: 1, b: 2 }, j: 'abs' })).toEqual('obj[a]=1&obj[b]=2&j=abs');
  });
});