import EventBus from './EventBus';

describe('core/EventBus', () => {
  it('should call listener when action emitted', () => {
    const eventBus = new EventBus();
    const mock = jest.fn();

    eventBus.on('SOME_ACTION', mock);
    eventBus.emit('SOME_ACTION');

    expect(mock).toHaveBeenCalled();
  });

  it('should throw error when trying off non-existent action', () => {
    const eventBus = new EventBus();
    const mock = jest.fn();

    expect(() => eventBus.off('SOME_ACTION', mock)).toThrow(Error);
  });
});
