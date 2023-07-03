import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const calc = simpleCalculator({ a: 2, b: 3, action: Action.Add });

    expect(calc).toBe(5);
  });

  test('should subtract two numbers', () => {
    const calc = simpleCalculator({ a: 5, b: 3, action: Action.Subtract });

    expect(calc).toBe(2);
  });

  test('should multiply two numbers', () => {
    const calc = simpleCalculator({ a: 2, b: 3, action: Action.Multiply });

    expect(calc).toBe(6);
  });

  test('should divide two numbers', () => {
    const calc = simpleCalculator({ a: 12, b: 3, action: Action.Divide });

    expect(calc).toBe(4);
  });

  test('should exponentiate two numbers', () => {
    const calc = simpleCalculator({ a: 2, b: 3, action: Action.Exponentiate });

    expect(calc).toBe(8);
  });

  test('should return null for invalid action', () => {
    const calc = simpleCalculator({ a: 2, b: 3, action: '**' });

    expect(calc).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const calc = simpleCalculator({ a: '2', b: 3, action: Action.Add });

    expect(calc).toBeNull();
  });
});
