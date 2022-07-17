import { formatDate } from './formatDate';

describe('utils/formatDate', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2021, 6, 14));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return full date for a date longer than a week', () => {
    expect(formatDate('2021-04-25T13:00:00')).toBe('25 Апр 2021');
  });

  it('should return week day with time for a date within a week range', () => {
    expect(formatDate('2021-07-10T13:00:00')).toBe('Сб 13:00');
  });

  it('should return time for a date within the same day', () => {
    expect(formatDate('2021-07-14T17:15:00')).toBe('17:15');
  });
});