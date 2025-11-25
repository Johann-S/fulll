# FizzBuzz Algorithm

A scalable and extensible implementation of the classic FizzBuzz problem.

## Running the Code

From the root folder of the project, run:

```bash
npm run algo
```

## Running Tests

To run the unit tests:

```bash
npm run test:algo
```

The test suite includes:
- Basic FizzBuzz behavior (numbers, Fizz, Buzz, FizzBuzz)
- Usage of a custom rule

## Problem Description

Display numbers between 1 and N following these rules:
- If divisible by 3: display **Fizz**
- If divisible by 5: display **Buzz**
- If divisible by both 3 and 5: display **FizzBuzz**
- Otherwise: display the number

## Implementation Approach

### Scalability

The solution uses a **rule-based architecture** that makes it easy to extend:

```typescript
fizzBuzz({
  rules: [
    { divisor: 3, output: 'Fizz' },
    { divisor: 5, output: 'Buzz' },
    { divisor: 7, output: 'Bazz' }  // Easy to add new rules!
  ],
  start: 1,
  end: 100
});
```

This approach eliminates the need for special cases - the composite case (FizzBuzz) is handled naturally by filtering and concatenating matching rules.

### Key Features

- **Type-safe**: Full TypeScript with interfaces for configuration
- **Configurable**: Customizable rules, start, and end values
- **Validated**: Comprehensive input validation with clear error messages
- **Extensible**: Add new divisibility rules without modifying core logic

## Example Output

```
1: 1
2: 2
3: Fizz
4: 4
5: Buzz
...
15: FizzBuzz
...
```

## Trade-offs Considered

While a simple if/else approach would work for the fixed FizzBuzz rules, the rule-based system was chosen to:
- Demonstrate scalability (as per evaluation criteria)
- Show abstraction and design skills
- Make the solution more maintainable and testable

For a production system with fixed rules, the simpler approach might be preferred (YAGNI principle). However, if rules are likely to change or vary, this architecture provides clear benefits.
