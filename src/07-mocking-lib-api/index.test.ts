import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

const baseURL = 'https://jsonplaceholder.typicode.com';
const relativePath = '/posts';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    // Arrange
    const mockedGet = jest.fn(async () => ({}));
    mockedAxios.create.mockReturnValue({
      get: mockedGet,
    } as unknown as typeof axios);

    // Act
    await throttledGetDataFromApi(relativePath);

    // Assert
    jest.runAllTimers();
    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    // Arrange
    const mockedGet = jest.fn(async () => ({}));
    mockedAxios.create.mockReturnValue({
      get: mockedGet,
    } as unknown as typeof axios);

    // Act
    jest.runAllTimers();
    await throttledGetDataFromApi(relativePath);

    // Assert
    jest.runAllTimers();
    expect(mockedGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    // Arrange
    const responseData = { id: 1, title: 'Test Post' };
    const mockedGet = jest.fn(async () => ({ data: responseData }));
    mockedAxios.create.mockReturnValue({
      get: mockedGet,
    } as unknown as typeof axios);

    // Act
    const result = await throttledGetDataFromApi(relativePath);

    // Assert
    expect(result).toEqual(responseData);
  });
});
