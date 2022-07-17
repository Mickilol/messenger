import { isEqual } from './isEqual';

describe('utils/myDash/isEqual', () => {
  it('should return true with identic objects', () => {
    expect(isEqual(
      { obj: { a: 1, b: 2 }, j: 'abs' },
      { obj: { a: 1, b: 2 }, j: 'abs' })
    ).toBe(true);
  });

  it('should return false with non-identic objects', () => {
    expect(isEqual(
      {
        chatModifyModal: {
          entity: 'CHAT',
          error: '',
          field: '',
          isAddMode: true,
          isLoading: false,
          isOpen: false
        },
        test: 12,
        anotherObj: {
          a: 1
        }
      },
      {
        chatModifyModal: {
          entity: 'CHAT',
          error: '',
          field: '',
          isAddMode: true,
          isLoading: false,
          isOpen: true
        },
        test: 12,
        anotherObj: {
          a: 1
        }
      })
    ).toBe(false);
  });
});