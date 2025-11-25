interface FizzBuzzRule {
  divisor: number;
  output: string;
}

interface FizzBuzzConfig {
  rules: FizzBuzzRule[];
  start?: number;
  end: number;
}

/**
 * Validates the configuration for the FizzBuzz algorithm
 *
 * @param config - Configuration object containing rules and range
 */
const validateConfig = (config: FizzBuzzConfig) => {
  const { rules, start = 1, end } = config;

  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    throw new Error('start and end must be integers');
  }

  if (start < 1) {
    throw new Error('start must be at least 1');
  }

  if (end < start) {
    throw new Error('end must be greater than or equal to start');
  }

  if (rules.length === 0) {
    throw new Error('at least one rule must be provided');
  }

  if (rules.some(rule => !Number.isInteger(rule.divisor) || rule.divisor <= 0)) {
    throw new Error('all rule divisors must be positive integers');
  }
};

/**
 * Generates FizzBuzz output for a given number based on the provided rules
 *
 * @param num - The number to evaluate
 * @param rules - Array of rules to apply
 */
const getFizzBuzzValue = (num: number, rules: FizzBuzzRule[]): string => {
  const result = rules
    .filter(rule => num % rule.divisor === 0)
    .map(rule => rule.output)
    .join('');

  return result || num.toString();
};

/**
 * Main FizzBuzz function with configurable rules
 *
 * @param config - Configuration object containing rules and range
 */
export const fizzBuzz = (config: FizzBuzzConfig) => {
  validateConfig(config);

  const { rules, start = 1, end } = config;
  const results: string[] = [];

  for (let i = start; i <= end; i++) {
    results.push(getFizzBuzzValue(i, rules));
  }

  return results;
};
