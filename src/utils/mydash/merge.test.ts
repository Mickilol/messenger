import { merge } from './merge';

describe('utils/myDash/merge', () => {
  it('should deep merge objects without rewriting properties', () => {
    expect(merge(
      { obj: { a: 1 }, c: '123' },
      { obj: { b: 2 }, j: 'abs' })
    ).toEqual({ obj: { a: 1, b: 2 }, c: '123', j: 'abs' });
  });
});