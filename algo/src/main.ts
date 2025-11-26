import { fizzBuzz } from './fizzbuzz';

const main = () => {
  const start = 1;
  const end = 20;

  console.log(`=== FizzBuzz (${start} to ${end}) ===\n`);

  fizzBuzz({
    rules: [
      { divisor: 3, output: 'Fizz' },
      { divisor: 5, output: 'Buzz' },
    ],
    start,
    end,
  })
    .forEach((value, index) => {
      const num = start + index;

      console.log(`${num}: ${value}`);
    });
};

main();
