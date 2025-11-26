import { describe, it } from 'node:test';
import assert from 'node:assert';

import { fizzBuzz } from './fizzbuzz';

describe('FizzBuzz', () => {
  describe('Basic functionality', () => {
    it('should return numbers that are not divisible by 3 or 5', () => {
      const result = fizzBuzz({
        rules: [
          { divisor: 3, output: 'Fizz' },
          { divisor: 5, output: 'Buzz' },
        ],
        start: 1,
        end: 2,
      });

      assert.deepStrictEqual(result, ['1', '2']);
    });

    it('should return "Fizz" for numbers divisible by 3', () => {
      const result = fizzBuzz({
        rules: [
          { divisor: 3, output: 'Fizz' },
          { divisor: 5, output: 'Buzz' },
        ],
        start: 3,
        end: 3,
      });

      assert.deepStrictEqual(result, ['Fizz']);
    });

    it('should return "Buzz" for numbers divisible by 5', () => {
      const result = fizzBuzz({
        rules: [
          { divisor: 3, output: 'Fizz' },
          { divisor: 5, output: 'Buzz' },
        ],
        start: 5,
        end: 5,
      });

      assert.deepStrictEqual(result, ['Buzz']);
    });

    it('should return "FizzBuzz" for numbers divisible by both 3 and 5', () => {
      const result = fizzBuzz({
        rules: [
          { divisor: 3, output: 'Fizz' },
          { divisor: 5, output: 'Buzz' },
        ],
        start: 15,
        end: 15,
      });

      assert.deepStrictEqual(result, ['FizzBuzz']);
    });
  });

  describe('Custom rules', () => {
    it('should work with a custom rule not related to FizzBuzz', () => {
      const result = fizzBuzz({
        rules: [
          { divisor: 2, output: 'Even' },
        ],
        start: 1,
        end: 4,
      });

      assert.deepStrictEqual(result, ['1', 'Even', '3', 'Even']);
    });
  });
});

