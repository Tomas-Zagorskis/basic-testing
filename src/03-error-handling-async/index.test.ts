import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = await resolveValue(5);

    expect(value).toBe(5);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect.assertions(2);

    try {
      throwError('custom message');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'custom message');
    }
  });

  test('should throw error with default message if message is not provided', () => {
    expect.assertions(2);

    try {
      throwError();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Oops!');
    }
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect.assertions(2);

    try {
      throwCustomError();
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);
      expect(error).toHaveProperty(
        'message',
        'This is my awesome custom error!',
      );
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect.assertions(2);

    await expect(rejectCustomError()).rejects.toBeInstanceOf(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toHaveProperty(
      'message',
      'This is my awesome custom error!',
    );
  });
});
