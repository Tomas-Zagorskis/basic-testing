import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    // Arrange
    const elements = [1, 2, 3];

    // Act
    const result = generateLinkedList(elements);

    // Assert
    expect(result).toStrictEqual({
      value: 1,
      next: { value: 2, next: { value: 3, next: { value: null, next: null } } },
    });
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    // Arrange
    const elements = ['a', 'b', 'c'];

    // Act
    const result = generateLinkedList(elements);

    // Assert
    expect(result).toMatchSnapshot();
  });
});
