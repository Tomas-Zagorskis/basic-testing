// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 6, b: 2, action: Action.Subtract, expected: 4 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 8, b: 2, action: Action.Divide, expected: 4 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
  { a: 3, b: 2, action: '**', expected: null },
  { a: '3', b: 2, action: Action.Add, expected: null },
  // continue cases for other actions
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should $a $action $b and get result $expected',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
  // Consider to use Jest table tests API to test all cases above
});
