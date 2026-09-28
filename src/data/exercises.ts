import { Exercise } from '../types/curriculum';

export const allExercises: Exercise[] = [
  {
    id: 'ex-1',
    title: 'Temperature Converter: Celsius to Fahrenheit',
    difficulty: 'easy',
    topic: 'Variables and Arithmetic',
    moduleId: 'mod-2',
    problemStatement: 'Write a function `celsius_to_fahrenheit(c)` that converts a Celsius temperature to Fahrenheit using the formula: F = (C * 9/5) + 32. Round the result to 2 decimal places.',
    constraints: ['c is a float or int', '-273.15 <= c <= 1000'],
    starterCode: `def celsius_to_fahrenheit(c: float) -> float:
    # Write your solution here
    pass

# Test your code
print(celsius_to_fahrenheit(0))   # Expected: 32.0
print(celsius_to_fahrenheit(100)) # Expected: 212.0
`,
    hints: [
      'Remember operator precedence: multiplication (*) and division (/) will evaluate before addition (+).',
      'Use the round(value, 2) built-in function to round to two decimal places.'
    ],
    testCases: [
      { input: '0', expectedOutput: '32.0', description: 'Freezing point of water' },
      { input: '100', expectedOutput: '212.0', description: 'Boiling point of water' },
      { input: '-40', expectedOutput: '-40.0', description: 'Convergence point' },
      { input: '37', expectedOutput: '98.6', description: 'Normal human body temperature' }
    ],
    solutionCode: `def celsius_to_fahrenheit(c: float) -> float:
    return round((c * 9 / 5) + 32, 2)
`,
    explanation: 'Multiply Celsius by 9/5 (or 1.8), add 32, and round to 2 decimals using round().'
  },
  {
    id: 'ex-2',
    title: 'Even or Odd Number Classifier',
    difficulty: 'easy',
    topic: 'Conditional Statements',
    moduleId: 'mod-3',
    problemStatement: 'Write a function `check_even_odd(n)` that returns the string "Even" if the integer `n` is divisible by 2, and "Odd" otherwise.',
    constraints: ['n is an integer between -10^6 and 10^6'],
    starterCode: `def check_even_odd(n: int) -> str:
    # Write your solution here
    pass

# Test your code
print(check_even_odd(4))  # Expected: "Even"
print(check_even_odd(7))  # Expected: "Odd"
print(check_even_odd(0))  # Expected: "Even"
`,
    hints: [
      'Use the modulus operator % to calculate the remainder of division by 2.',
      'If n % 2 == 0, the number is even.'
    ],
    testCases: [
      { input: '4', expectedOutput: 'Even', description: 'Positive even' },
      { input: '7', expectedOutput: 'Odd', description: 'Positive odd' },
      { input: '0', expectedOutput: 'Even', description: 'Zero is even' },
      { input: '-3', expectedOutput: 'Odd', description: 'Negative odd' }
    ],
    solutionCode: `def check_even_odd(n: int) -> str:
    return "Even" if n % 2 == 0 else "Odd"
`,
    explanation: 'The remainder of division by 2 determines parity: remainder 0 is Even, remainder 1 (or -1) is Odd.'
  },
  {
    id: 'ex-3',
    title: 'Sum of Multiples (FizzBuzz Style Accumulator)',
    difficulty: 'easy',
    topic: 'Loops and Iteration',
    moduleId: 'mod-4',
    problemStatement: 'Write a function `sum_multiples(n)` that returns the sum of all positive integers strictly less than `n` that are divisible by 3 or 5.',
    constraints: ['n is a positive integer', 'n <= 10000'],
    starterCode: `def sum_multiples(n: int) -> int:
    # Write your solution here
    pass

# Test your code
print(sum_multiples(10)) # 3 + 5 + 6 + 9 = 23
`,
    hints: [
      'Loop over range(1, n) using a for loop.',
      'Check if i % 3 == 0 or i % 5 == 0, and add matching numbers to a running total.'
    ],
    testCases: [
      { input: '10', expectedOutput: '23', description: 'Numbers 3, 5, 6, 9' },
      { input: '16', expectedOutput: '60', description: 'Multiples under 16' },
      { input: '1', expectedOutput: '0', description: 'Boundary case: no numbers under 1' }
    ],
    solutionCode: `def sum_multiples(n: int) -> int:
    return sum(x for x in range(1, n) if x % 3 == 0 or x % 5 == 0)
`,
    explanation: 'A generator expression with conditional filtering sums all numbers under n divisible by 3 or 5 in a single idiomatic line.'
  },
  {
    id: 'ex-4',
    title: 'Palindrome Sentence Checker',
    difficulty: 'medium',
    topic: 'Strings and Collections',
    moduleId: 'mod-5',
    problemStatement: 'Write a function `is_palindrome(s)` that determines if a string is a palindrome, ignoring casing, spaces, and punctuation (considering only alphanumeric characters). Return True or False.',
    constraints: ['s is a string of length up to 1000'],
    starterCode: `def is_palindrome(s: str) -> bool:
    # Write your solution here
    pass

# Test your code
print(is_palindrome("A man, a plan, a canal: Panama")) # Expected: True
print(is_palindrome("race a car"))                     # Expected: False
`,
    hints: [
      'Filter characters using char.isalnum() to ignore spaces and punctuation.',
      'Convert to lowercase using .lower().',
      'Compare the cleaned string to its reversed version [::-1].'
    ],
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'True', description: 'Famous Panama palindrome' },
      { input: '"race a car"', expectedOutput: 'False', description: 'Not a palindrome' },
      { input: '"Was it a car or a cat I saw?"', expectedOutput: 'True', description: 'Case and punctuation insensitive' },
      { input: '""', expectedOutput: 'True', description: 'Empty string is trivially a palindrome' }
    ],
    solutionCode: `def is_palindrome(s: str) -> bool:
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]
`,
    explanation: 'Filter each character with c.isalnum(), convert to lower-case, and compare the list with its reversed slice.'
  },
  {
    id: 'ex-5',
    title: 'Word Frequency Counter',
    difficulty: 'medium',
    topic: 'Dictionaries and Sets',
    moduleId: 'mod-5',
    problemStatement: 'Write a function `word_frequencies(text)` that takes a string of text and returns a dictionary mapping each lowercased word to its count. Words are separated by whitespace.',
    constraints: ['Text contains words separated by whitespace'],
    starterCode: `def word_frequencies(text: str) -> dict:
    # Write your solution here
    pass

# Test your code
print(word_frequencies("to be or not to be"))
# Expected: {'to': 2, 'be': 2, 'or': 1, 'not': 1}
`,
    hints: [
      'Use text.lower().split() to extract lowercase words into a list.',
      'Iterate through the words and use dict.get(word, 0) + 1 to tally counts.'
    ],
    testCases: [
      { input: '"to be or not to be"', expectedOutput: "{'to': 2, 'be': 2, 'or': 1, 'not': 1}", description: 'Repeated Shakespeare quote' },
      { input: '"Python Python python"', expectedOutput: "{'python': 3}", description: 'Case normalization test' }
    ],
    solutionCode: `def word_frequencies(text: str) -> dict:
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    return counts
`,
    explanation: 'Split by whitespace, lower-case each token, and accumulate into a hash dictionary using get(word, 0) + 1.'
  },
  {
    id: 'ex-6',
    title: 'Flatten Nested Lists Recursively',
    difficulty: 'hard',
    topic: 'Functions and Recursion',
    moduleId: 'mod-6',
    problemStatement: 'Write a recursive function `flatten_list(nested)` that takes an arbitrarily deep nested list and returns a flat 1D list containing all non-list items in order.',
    constraints: ['nested contains integers or other nested lists'],
    starterCode: `def flatten_list(nested: list) -> list:
    # Write your recursive solution here
    pass

# Test your code
print(flatten_list([1, [2, [3, 4], 5], 6])) # Expected: [1, 2, 3, 4, 5, 6]
`,
    hints: [
      'Iterate through elements: if isinstance(item, list), recursively call flatten_list(item) and extend the result.',
      'If item is not a list, append it directly.'
    ],
    testCases: [
      { input: '[1, [2, [3, 4], 5], 6]', expectedOutput: '[1, 2, 3, 4, 5, 6]', description: 'Multi-level nesting' },
      { input: '[[1], [[2]], [[[3]]]]', expectedOutput: '[1, 2, 3]', description: 'Deep single elements' },
      { input: '[]', expectedOutput: '[]', description: 'Empty list' }
    ],
    solutionCode: `def flatten_list(nested: list) -> list:
    flat = []
    for item in nested:
        if isinstance(item, list):
            flat.extend(flatten_list(item))
        else:
            flat.append(item)
    return flat
`,
    explanation: 'Recursively decompose sub-lists and concatenate flattened elements using extend().'
  },
  {
    id: 'ex-7',
    title: 'Two Sum (Optimal O(N) Hash Table Solution)',
    difficulty: 'hard',
    topic: 'Algorithms and Data Structures',
    moduleId: 'mod-11',
    problemStatement: 'Given an array of integers `nums` and an integer `target`, return the indices `[i, j]` of the two numbers such that they add up to `target`. Each input has exactly one solution, and you may not use the same element twice. Solve in O(n) time using a hash map.',
    constraints: ['2 <= len(nums) <= 10^5', 'Exactly one valid answer exists'],
    starterCode: `def two_sum(nums: list, target: int) -> list:
    # Write your O(n) hash map solution here
    pass

# Test your code
print(two_sum([2, 7, 11, 15], 9)) # Expected: [0, 1]
print(two_sum([3, 2, 4], 6))       # Expected: [1, 2]
`,
    hints: [
      'As you iterate, calculate complement = target - num.',
      'If complement exists in your seen dictionary, you have found the pair!'
    ],
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', description: '2 + 7 == 9' },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', description: '2 + 4 == 6' },
      { input: '[3, 3], 6', expectedOutput: '[0, 1]', description: 'Duplicate values' }
    ],
    solutionCode: `def two_sum(nums: list, target: int) -> list:
    seen = {}
    for idx, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], idx]
        seen[num] = idx
    return []
`,
    explanation: 'A hash map stores previously seen numbers and their indices, allowing complement checks in O(1) time.'
  }
];
