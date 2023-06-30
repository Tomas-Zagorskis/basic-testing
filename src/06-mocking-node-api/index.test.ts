import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    // Arrange
    const callback = jest.fn();
    const timeout = 1000;
    jest.spyOn(global, 'setTimeout').mock;

    // Act
    doStuffByTimeout(callback, timeout);

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, timeout);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    // Arrange
    const callback = jest.fn();
    const timeout = 100;

    // Act
    doStuffByTimeout(callback, timeout);
    jest.runOnlyPendingTimers();

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    // Arrange
    const callback = jest.fn();
    const interval = 200;
    jest.spyOn(global, 'setInterval').mock;

    // Act
    doStuffByInterval(callback, interval);

    // Assert
    expect(setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    // Arrange
    const callback = jest.fn();
    const interval = 200;
    const numIntervals = 3;

    // Act
    doStuffByInterval(callback, interval);
    jest.advanceTimersByTime(numIntervals * interval);

    // Assert
    expect(callback).toHaveBeenCalledTimes(numIntervals);
  });
});

describe('readFileAsynchronously', () => {
  const mockFileContent = 'This is a test file';
  const mockPathToFile = 'test.txt';
  const mockFullPath = '/files/test.txt';

  beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should call join with pathToFile', async () => {
    // Arrange
    const joinSpy = jest.spyOn(path, 'join').mockReturnValue(mockFullPath);

    // Act
    await readFileAsynchronously(mockPathToFile);

    // Assert
    expect(joinSpy).toHaveBeenCalledWith(__dirname, mockPathToFile);
  });

  test('should return null if file does not exist', async () => {
    // Arrange
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Act
    const result = await readFileAsynchronously(mockPathToFile);

    // Assert
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    // Arrange
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(mockFileContent);

    // Act
    const result = await readFileAsynchronously(mockPathToFile);

    // Assert
    expect(result).toBe(mockFileContent);
  });
});
