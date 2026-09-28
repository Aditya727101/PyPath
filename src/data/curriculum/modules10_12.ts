import { Module } from '../../types/curriculum';

export const modules10_12: Module[] = [
  {
    id: 'mod-10',
    order: 10,
    number: 10,
    title: 'Intermediate and Advanced Python',
    slug: 'intermediate-and-advanced-python',
    tagline: 'Comprehensions, generators, decorators, dataclasses, typing, and memory deep copies',
    description: 'Elevate your Python skills to senior level. Master list/dict/set comprehensions, lazy generators with yield, function decorators, contextlib context managers, static type hints, dataclasses, enums, and shallow vs deep copies.',
    difficulty: 'advanced',
    iconName: 'Zap',
    prerequisites: ['mod-9'],
    learningObjectives: [
      'Write idiomatic list, dictionary, and set comprehensions with conditional filtering',
      'Build memory-efficient streaming pipelines using generator functions and yield',
      'Author custom decorators using closures and functools.wraps',
      'Use dataclasses to reduce boilerplate in data-centric classes',
      'Differentiate shallow copies (copy.copy) from deep recursive copies (copy.deepcopy)'
    ],
    estimatedHours: 7,
    lessons: [
      {
        id: 'les-10-1',
        moduleId: 'mod-10',
        order: 1,
        title: 'Comprehensions & Generator Expressions',
        slug: 'comprehensions-and-generators',
        difficulty: 'advanced',
        durationMinutes: 30,
        prerequisites: ['les-9-3'],
        learningObjectives: [
          'Replace boilerplate loops with concise list/dict/set comprehensions',
          'Understand how `yield` creates lazy generators that do not allocate memory for all items at once',
          'Use generator expressions `(...)` for streaming massive datasets'
        ],
        concepts: ['List Comprehension', 'Dict Comprehension', 'yield', 'Generators', 'Lazy Evaluation'],
        summary: 'Comprehensions transform iterables concisely. Generators use `yield` to produce values one at a time on demand, enabling processing of arbitrarily large datasets with O(1) memory.',
        starterCode: `# Compare memory footprint: List vs Generator
import sys

# List allocates all 100,000 items in memory at once
numbers_list = [x ** 2 for x in range(100000)]

# Generator produces values lazily on demand
numbers_gen = (x ** 2 for x in range(100000))

print(f"List memory size:      {sys.getsizeof(numbers_list):,} bytes")
print(f"Generator memory size: {sys.getsizeof(numbers_gen):,} bytes")
print("First 3 generator items:", next(numbers_gen), next(numbers_gen), next(numbers_gen))
`,
        sections: [
          {
            id: 'sec-10-1-1',
            title: 'Comprehensions & The yield Keyword',
            content: `### Comprehension Formats:
- **List:** \`[expr for item in iterable if condition]\`
- **Dict:** \`{key_expr: val_expr for item in iterable if condition}\`
- **Set:** \`{expr for item in iterable if condition}\`

### How \`yield\` Works:
When a function contains \`yield\`, it becomes a **generator function**. Calling it does not run the body immediately; it returns a generator object.
Each time \`next()\` is called on the generator, it resumes execution right where it paused at \`yield\`!`,
            codeExamples: [
              {
                title: 'Streaming Infinite Fibonacci with a Generator',
                description: 'Generators can represent mathematically infinite sequences without crashing memory.',
                code: `def fibonacci_stream():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci_stream()
first_10 = [next(gen) for _ in range(10)]
print("First 10 Fibonacci numbers:", first_10)
`,
                expectedOutput: `First 10 Fibonacci numbers: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
                lineByLine: [
                  { line: 'yield a', explanation: 'Emits the current number and pauses the execution state until the caller asks for the next item.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Reusing an exhausted generator',
                why: 'Generators can only be iterated over once. Once exhausted, subsequent attempts return nothing without error.',
                fix: 'If you need multiple passes over the data, convert to a list: list(gen).',
                badCode: 'g = (x for x in [1, 2])\nsum1 = sum(g)\nsum2 = sum(g) # sum2 is 0 because g is already exhausted!',
                goodCode: 'items = list(x for x in [1, 2])\nsum1 = sum(items)\nsum2 = sum(items)'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-10-1',
          title: 'Lesson 10.1 Knowledge Check',
          moduleId: 'mod-10',
          lessonId: 'les-10-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-10-1-1',
              type: 'predict-output',
              question: 'What is the result of `[x * 2 for x in range(5) if x % 2 == 1]`?',
              codeSnippet: 'print([x * 2 for x in range(5) if x % 2 == 1])',
              options: ['[2, 6]', '[0, 4, 8]', '[1, 3]', '[2, 4, 6]'],
              correctOptionIndex: 0,
              explanation: 'Odd numbers in range(5) are 1 and 3. Multiplying each by 2 yields [2, 6].'
            },
            {
              id: 'q-10-1-2',
              type: 'mcq',
              question: 'What does a function return when it contains the `yield` keyword?',
              options: ['A tuple', 'A generator object', 'None', 'The final return value'],
              correctOptionIndex: 1,
              explanation: 'A function with `yield` returns a generator object that produces items on demand.'
            }
          ]
        }
      },
      {
        id: 'les-10-2',
        moduleId: 'mod-10',
        order: 2,
        title: 'Decorators, Dataclasses & Deep Copying',
        slug: 'decorators-dataclasses-and-copying',
        difficulty: 'advanced',
        durationMinutes: 35,
        prerequisites: ['les-10-1'],
        learningObjectives: [
          'Write custom decorators to measure execution time or validate authentication',
          'Use @dataclass from the dataclasses module to generate __init__, __repr__, and __eq__ automatically',
          'Understand why copy.deepcopy() is required for nested mutable structures'
        ],
        concepts: ['Decorators', 'Closures', '@dataclass', 'copy.copy vs copy.deepcopy'],
        summary: 'Decorators dynamically wrap functions with extra behavior. Dataclasses eliminate boilerplate for data models. Deepcopy duplicates nested objects recursively.',
        starterCode: `# 1. Measuring execution time with a Decorator
import time
from functools import wraps
from dataclasses import dataclass
import copy

def time_it(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = func(*args, **kwargs)
        duration_ms = (time.perf_counter() - t0) * 1000
        print(f"⏱️  {func.__name__} executed in {duration_ms:.2f} ms")
        return result
    return wrapper

@dataclass
class LessonProgress:
    lesson_id: str
    completed: bool = False
    score: int = 0

@time_it
def simulate_heavy_batch():
    time.sleep(0.05)
    return [LessonProgress(f"les-{i}", True, 95) for i in range(5)]

batch = simulate_heavy_batch()
print("Sample dataclass representation:", batch[0])
`,
        sections: [
          {
            id: 'sec-10-2-1',
            title: 'Shallow Copy vs Deep Copy',
            content: `When you have nested structures (e.g., a list containing other lists):
- **\`copy.copy(obj)\` (Shallow):** Creates a new outer container, but **references the exact same inner objects**.
- **\`copy.deepcopy(obj)\` (Deep):** Recursively creates brand new copies of **all** nested objects.

If you modify an inner list in a shallow copy, the original object is also modified!`,
            codeExamples: [
              {
                title: 'The Danger of Shallow Copies on Nested Data',
                description: 'Showing how shallow copies mutate shared inner lists.',
                code: `import copy

original = [["A", "B"], ["C", "D"]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

# Modify an inner element in the shallow copy
shallow[0][0] = "MUTATED"

print("Original [0][0]:", original[0][0]) # Mutated!
print("Deep     [0][0]:", deep[0][0])     # Safely preserved as "A"!
`,
                expectedOutput: `Original [0][0]: MUTATED
Deep     [0][0]: A`,
                lineByLine: [
                  { line: 'shallow = copy.copy(original)', explanation: 'Outer list is duplicated, but inner lists are shared references.' },
                  { line: 'deep = copy.deepcopy(original)', explanation: 'All nested layers are cloned into fresh heap memory allocations.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Omitting @wraps(func) in custom decorators',
                why: 'Without @wraps, the decorated function loses its original name and docstring, reporting the wrapper function\'s name instead.',
                fix: 'Always apply @functools.wraps(func) to your inner wrapper.',
                badCode: 'def my_dec(f):\n    def wrapper(): return f()\n    return wrapper',
                goodCode: 'from functools import wraps\ndef my_dec(f):\n    @wraps(f)\n    def wrapper(): return f()\n    return wrapper'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-10-2',
          title: 'Lesson 10.2 Knowledge Check',
          moduleId: 'mod-10',
          lessonId: 'les-10-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-10-2-1',
              type: 'mcq',
              question: 'What methods does `@dataclass` generate automatically for you?',
              options: [
                '__init__, __repr__, and __eq__',
                '__enter__ and __exit__',
                'run() and stop()',
                '__iter__ and __next__'
              ],
              correctOptionIndex: 0,
              explanation: '`@dataclass` analyzes type annotations to automatically create `__init__`, `__repr__`, and `__eq__` methods.'
            },
            {
              id: 'q-10-2-2',
              type: 'mcq',
              question: 'Why should you use `copy.deepcopy()` instead of `copy.copy()` on nested structures?',
              options: [
                'Deepcopy uses less RAM.',
                'Shallow copy only duplicates the outer container, leaving nested mutable objects shared and vulnerable to unintended mutations.',
                'copy.copy() is deprecated in Python 3.12.',
                'Deepcopy only works on integers.'
              ],
              correctOptionIndex: 1,
              explanation: 'A shallow copy shares references to nested children. `deepcopy` clones the complete object tree recursively.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-10',
      title: 'Module 10 Assessment: Advanced Python',
      moduleId: 'mod-10',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-10-1',
          type: 'predict-output',
          question: 'What is the output of `{x: x**2 for x in range(3)}`?',
          codeSnippet: 'print({x: x**2 for x in range(3)})',
          options: ['{0: 0, 1: 1, 2: 4}', '[0, 1, 4]', '{0, 1, 4}', '{0: 1, 1: 2, 2: 3}'],
          correctOptionIndex: 0,
          explanation: 'Dictionary comprehension mapping each number in 0, 1, 2 to its square.'
        },
        {
          id: 'cq-10-2',
          type: 'mcq',
          question: 'What happens when a generator function finishes all yield statements and terminates?',
          options: [
            'It restarts from the beginning.',
            'It raises a StopIteration exception, signaling loops to conclude.',
            'It returns None and crashes.',
            'The operating system frees the CPU.'
          ],
          correctOptionIndex: 1,
          explanation: 'Python\'s iteration protocol relies on `StopIteration` to signal the end of a sequence.'
        },
        {
          id: 'cq-10-3',
          type: 'mcq',
          question: 'What is a decorator in Python syntactically equivalent to?',
          options: [
            'func = decorator(func)',
            'func = class(decorator)',
            'decorator = func()',
            'import decorator'
          ],
          correctOptionIndex: 0,
          explanation: 'Applying `@dec` above `def func():` is syntax sugar for `func = dec(func)`.'
        },
        {
          id: 'cq-10-4',
          type: 'predict-output',
          question: 'What is the output of `type((x for x in range(3)))`?',
          codeSnippet: 'print(type((x for x in range(3))).__name__)',
          options: ['generator', 'tuple', 'list', 'range'],
          correctOptionIndex: 0,
          explanation: 'Parentheses around a comprehension create a generator expression, not a tuple!'
        },
        {
          id: 'cq-10-5',
          type: 'mcq',
          question: 'Which module in the Python standard library provides Enum and IntEnum?',
          options: ['enum', 'types', 'dataclasses', 'constants'],
          correctOptionIndex: 0,
          explanation: 'The `enum` module provides `Enum` and `IntEnum` for defining enumerated constants.'
        }
      ]
    }
  },
  {
    id: 'mod-11',
    order: 11,
    number: 11,
    title: 'Algorithms and Data Structures',
    slug: 'algorithms-and-data-structures',
    tagline: 'Big-O notation, binary search, sorting algorithms, stacks, queues, and complexity analysis',
    description: 'Think like a computer scientist. Master asymptotic Big-O time and space complexity, implement binary search, bubble sort, insertion sort, merge sort, stacks, queues with collections.deque, and recursion trees.',
    difficulty: 'advanced',
    iconName: 'Network',
    prerequisites: ['mod-10'],
    learningObjectives: [
      'Analyze algorithms using Big-O asymptotic notation: O(1), O(log n), O(n), O(n log n), O(n^2)',
      'Implement Linear Search and O(log n) Binary Search with pointers',
      'Compare quadratic sorting (Bubble, Insertion) vs divide-and-conquer Merge Sort',
      'Use collections.deque for O(1) double-ended queue operations',
      'Select optimal data structures for space-time trade-offs'
    ],
    estimatedHours: 8,
    lessons: [
      {
        id: 'les-11-1',
        moduleId: 'mod-11',
        order: 1,
        title: 'Algorithmic Thinking & Big-O Notation',
        slug: 'algorithmic-thinking-and-big-o',
        difficulty: 'advanced',
        durationMinutes: 30,
        prerequisites: ['les-10-2'],
        learningObjectives: [
          'Understand worst-case time and space complexity',
          'Recognize common Big-O classes: Constant O(1), Logarithmic O(log n), Linear O(n), Quadratic O(n^2)',
          'Learn why list.insert(0, x) is O(n) while deque.appendleft(x) is O(1)'
        ],
        concepts: ['Big-O Notation', 'Time Complexity', 'Space Complexity', 'collections.deque'],
        summary: 'Big-O notation describes how execution time or memory requirements scale as the input size n approaches infinity, disregarding constant factors and hardware differences.',
        starterCode: `# Big-O benchmark: list.pop(0) [O(n)] vs deque.popleft() [O(1)]
from collections import deque
import time

N = 50000

# 1. Standard List: popping from the front shifts all N items! -> O(n)
std_list = list(range(N))
t0 = time.perf_counter()
while std_list:
    std_list.pop(0)
list_duration = (time.perf_counter() - t0) * 1000

# 2. Deque: double-ended queue with pointer adjustment -> O(1)
dq = deque(range(N))
t0 = time.perf_counter()
while dq:
    dq.popleft()
deque_duration = (time.perf_counter() - t0) * 1000

print(f"List pop(0)  O(N^2 total): {list_duration:.2f} ms")
print(f"Deque popleft() O(N total): {deque_duration:.2f} ms")
print(f"Speedup: {list_duration / max(deque_duration, 0.001):.1f}x faster!")
`,
        sections: [
          {
            id: 'sec-11-1-1',
            title: 'Big-O Hierarchy: From Best to Worst',
            content: `1. **\`O(1)\` — Constant Time:** Hash map lookup (\`dict[k]\`), appending to end of list (\`lst.append(x)\`).
2. **\`O(log n)\` — Logarithmic Time:** Binary Search (halving search space each step).
3. **\`O(n)\` — Linear Time:** Iterating through an array, searching an unsorted list.
4. **\`O(n log n)\` — Linearithmic Time:** Optimal sorting algorithms (Merge Sort, Python\'s Timsort).
5. **\`O(n^2)\` — Quadratic Time:** Nested loops over the input (Bubble Sort, naive matching).
6. **\`O(2^n)\` — Exponential Time:** Naive recursive Fibonacci without memoization.`,
            codeExamples: [
              {
                title: 'Constant vs Linear Operations',
                description: 'Demonstrating why membership testing in a set is O(1) vs list O(n).',
                code: `data_list = list(range(100000))
data_set = set(data_list)

target = 99999

# Set lookup uses hash table: O(1)
print("Found in set:", target in data_set)
# List lookup inspects elements sequentially: O(n)
print("Found in list:", target in data_list)
`,
                expectedOutput: `Found in set: True
Found in list: True`,
                lineByLine: [
                  { line: 'target in data_set', explanation: 'Computes hash(target) % table_size and jumps directly to the memory slot in O(1) time.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Using list as a FIFO queue with list.pop(0)',
                why: 'When you remove the first element of a Python list, all remaining elements must shift left in memory, making it an O(n) operation. A loop of N items becomes O(n^2)!',
                fix: 'Use `collections.deque` which supports O(1) popleft() and appendleft().',
                badCode: 'q = [1, 2, 3]; item = q.pop(0) # O(n) shift!',
                goodCode: 'from collections import deque; q = deque([1, 2, 3]); item = q.popleft() # O(1)'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-11-1',
          title: 'Lesson 11.1 Knowledge Check',
          moduleId: 'mod-11',
          lessonId: 'les-11-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-11-1-1',
              type: 'mcq',
              question: 'What is the time complexity of searching for an item in a Python set containing n elements?',
              options: ['O(n)', 'O(1) on average', 'O(n^2)', 'O(log n)'],
              correctOptionIndex: 1,
              explanation: 'Python sets are implemented as hash tables, providing O(1) average-case lookups.'
            },
            {
              id: 'q-11-1-2',
              type: 'mcq',
              question: 'If an algorithm contains two nested loops, each iterating from 0 to n, what is its overall time complexity?',
              options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2n)'],
              correctOptionIndex: 2,
              explanation: 'Executing n iterations inside n iterations results in n * n = O(n^2) quadratic complexity.'
            }
          ]
        }
      },
      {
        id: 'les-11-2',
        moduleId: 'mod-11',
        order: 2,
        title: 'Binary Search & Sorting Algorithms',
        slug: 'binary-search-and-sorting',
        difficulty: 'advanced',
        durationMinutes: 35,
        prerequisites: ['les-11-1'],
        learningObjectives: [
          'Implement Binary Search with left/right pointers in O(log n) time',
          'Implement Merge Sort using Divide and Conquer in O(n log n) time',
          'Understand stability and in-place vs out-of-place sorting'
        ],
        concepts: ['Binary Search', 'Merge Sort', 'Divide and Conquer', 'Two Pointers'],
        summary: 'Binary search finds elements in a sorted array in O(log n) time by repeatedly halving the search space. Merge sort divides an array into halves and merges them back in sorted order.',
        starterCode: `# Implementing O(log n) Binary Search
def binary_search(sorted_arr, target):
    low = 0
    high = len(sorted_arr) - 1
    steps = 0
    
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        guess = sorted_arr[mid]
        
        print(f"Step {steps}: checking index {mid} (value={guess})")
        if guess == target:
            return mid, steps
        elif guess < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1, steps

data = [3, 7, 12, 19, 25, 31, 44, 58, 67, 82, 95]
idx, steps_taken = binary_search(data, 58)
print(f"Target 58 found at index {idx} in only {steps_taken} steps!")
`,
        sections: [
          {
            id: 'sec-11-2-1',
            title: 'Divide and Conquer: Merge Sort',
            content: `Merge Sort breaks down an array into single-element subarrays, then merges pairs together in sorted order.
It achieves **\`O(n log n)\`** time complexity in all cases (best, worst, average).

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
\`\`\``,
            codeExamples: [
              {
                title: 'Merge Sort Implementation',
                description: 'Sorting an unsorted list with pure merge sort.',
                code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge sorted halves
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

unsorted = [64, 34, 25, 12, 22, 11, 90]
sorted_list = merge_sort(unsorted)
print("Unsorted:", unsorted)
print("Sorted:  ", sorted_list)
`,
                expectedOutput: `Unsorted: [64, 34, 25, 12, 22, 11, 90]
Sorted:   [11, 12, 22, 25, 34, 64, 90]`,
                lineByLine: [
                  { line: 'left = merge_sort(arr[:mid])', explanation: 'Recursively sorts the left half.' },
                  { line: 'while i < len(left) and j < len(right):', explanation: 'Merges the two sorted sub-lists into a single ordered output.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Running Binary Search on an unsorted array',
                why: 'Binary search fundamentally relies on the mathematical guarantee that elements to the left are smaller and elements to the right are greater. On unsorted data, it produces incorrect results.',
                fix: 'Always sort the array first (or use linear search if sorting overhead exceeds lookup count).',
                badCode: 'arr = [5, 2, 9, 1]; binary_search(arr, 9) # Returns wrong result!',
                goodCode: 'arr.sort(); binary_search(arr, 9)'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-11-2',
          title: 'Lesson 11.2 Knowledge Check',
          moduleId: 'mod-11',
          lessonId: 'les-11-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-11-2-1',
              type: 'mcq',
              question: 'In the worst case, how many comparisons does Binary Search take on an array of 1,000,000 sorted elements?',
              options: ['1,000,000', '500,000', 'Around 20 comparisons (log2(1,000,000))', '10,000'],
              correctOptionIndex: 2,
              explanation: 'log2(1,000,000) is approximately 19.93, meaning at most 20 comparisons are needed to find any element or determine it is absent.'
            },
            {
              id: 'q-11-2-2',
              type: 'mcq',
              question: 'What is the worst-case time complexity of Merge Sort?',
              options: ['O(n^2)', 'O(n log n)', 'O(n)', 'O(log n)'],
              correctOptionIndex: 1,
              explanation: 'Merge sort maintains O(n log n) time complexity across best, average, and worst cases.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-11',
      title: 'Module 11 Assessment: Algorithms & Data Structures',
      moduleId: 'mod-11',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-11-1',
          type: 'mcq',
          question: 'What data structure operates on a Last-In, First-Out (LIFO) principle?',
          options: ['Queue', 'Stack', 'Array', 'Binary Tree'],
          correctOptionIndex: 1,
          explanation: 'A Stack is LIFO: the last element pushed onto the stack is the first one popped off.'
        },
        {
          id: 'cq-11-2',
          type: 'mcq',
          question: 'What is the algorithm used internally by Python\'s built-in `.sort()` and `sorted()` functions?',
          options: ['QuickSort', 'BubbleSort', 'Timsort (hybrid of Merge Sort and Insertion Sort)', 'HeapSort'],
          correctOptionIndex: 2,
          explanation: 'Python uses Timsort, created by Tim Peters in 2002, which takes advantage of existing sorted runs in real-world data.'
        },
        {
          id: 'cq-11-3',
          type: 'predict-output',
          question: 'What is the value of `mid` when `low=3` and `high=8` in `mid = (low + high) // 2`?',
          options: ['5', '5.5', '6', '11'],
          correctOptionIndex: 0,
          explanation: '(3 + 8) // 2 = 11 // 2 = 5.'
        },
        {
          id: 'cq-11-4',
          type: 'mcq',
          question: 'Which of the following operations takes O(1) constant time on a Python list?',
          options: ['list.pop(0)', 'list.insert(0, val)', 'list.append(val)', 'val in list'],
          correctOptionIndex: 2,
          explanation: 'Appending to the end of a list is amortized O(1) because no subsequent elements have to shift.'
        },
        {
          id: 'cq-11-5',
          type: 'mcq',
          question: 'What is the space complexity of an in-place Bubble Sort?',
          options: ['O(n)', 'O(1) auxiliary space', 'O(n^2)', 'O(log n)'],
          correctOptionIndex: 1,
          explanation: 'In-place sorting modifies the array with only a few pointer variables, requiring O(1) auxiliary space.'
        }
      ]
    }
  },
  {
    id: 'mod-12',
    order: 12,
    number: 12,
    title: 'Practical Python & Professional Engineering',
    slug: 'practical-python-and-engineering',
    tagline: 'Debugging, tracebacks, unit testing with unittest, logging, regex, and PEP 8',
    description: 'Bridge the gap from coding learner to industry professional. Learn how to read tracebacks, write automated unit tests using unittest, use regular expressions (re) for string pattern matching, replace print with Python\'s logging module, and enforce PEP 8 style standards.',
    difficulty: 'advanced',
    iconName: 'ShieldCheck',
    prerequisites: ['mod-11'],
    learningObjectives: [
      'Deconstruct Python exception tracebacks from bottom to top',
      'Author test suites using the standard unittest framework (TestCase, assertEqual)',
      'Parse text patterns using regular expressions (re.search, re.findall, capture groups)',
      'Configure logging levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)',
      'Adhere to PEP 8 styling conventions for clean, maintainable Python code'
    ],
    estimatedHours: 6,
    lessons: [
      {
        id: 'les-12-1',
        moduleId: 'mod-12',
        order: 1,
        title: 'Tracebacks, Debugging & Unit Testing with unittest',
        slug: 'tracebacks-and-unit-testing',
        difficulty: 'advanced',
        durationMinutes: 30,
        prerequisites: ['les-11-2'],
        learningObjectives: [
          'Read tracebacks from the bottom (error type) to top (call chain)',
          'Create test classes inheriting from unittest.TestCase',
          'Use assertions: assertEqual, assertTrue, assertRaises'
        ],
        concepts: ['Traceback', 'unittest', 'TestCase', 'Assertions', 'Test Fixtures'],
        summary: 'Unit testing verifies that individual functions perform accurately under expected, edge, and erroneous inputs. Python\'s built-in unittest module provides test runners and rich assertions.',
        starterCode: `# Writing automated test cases with unittest
import unittest

def normalize_slug(text: str) -> str:
    """Converts a title to a URL-friendly lowercase slug."""
    clean = text.strip().lower()
    return "-".join(clean.split())

class TestSlugUtility(unittest.TestCase):
    def test_basic_slug(self):
        self.assertEqual(normalize_slug("Python Mastery"), "python-mastery")

    def test_extra_whitespace(self):
        self.assertEqual(normalize_slug("  Learn   Python  Now  "), "learn-python-now")

    def test_already_slug(self):
        self.assertEqual(normalize_slug("ready-to-go"), "ready-to-go")

# Run test suite
suite = unittest.TestLoader().loadTestsFromTestCase(TestSlugUtility)
runner = unittest.TextTestRunner(verbosity=2)
runner.run(suite)
`,
        sections: [
          {
            id: 'sec-12-1-1',
            title: 'How to Read a Python Traceback',
            content: `When Python crashes, it prints a traceback. Always read it **from bottom to top**:
1. **The very last line:** States the exception type and human message (\`ZeroDivisionError: division by zero\`).
2. **The line immediately above:** The exact line number in your file where execution halted.
3. **The upper lines:** The call chain of functions leading to that point.`,
            codeExamples: [
              {
                title: 'Testing for Expected Exceptions',
                description: 'Using self.assertRaises to confirm functions reject bad inputs.',
                code: `import unittest

def calculate_discount(price: float, discount: float) -> float:
    if discount < 0 or discount > 1:
        raise ValueError("Discount must be between 0.0 and 1.0")
    return price * (1 - discount)

class TestDiscount(unittest.TestCase):
    def test_valid_discount(self):
        self.assertAlmostEqual(calculate_discount(100.0, 0.20), 80.0)

    def test_invalid_discount_raises(self):
        with self.assertRaises(ValueError):
            calculate_discount(100.0, 1.5) # 150% discount is illegal!

suite = unittest.TestLoader().loadTestsFromTestCase(TestDiscount)
runner = unittest.TextTestRunner(verbosity=1)
runner.run(suite)
`,
                expectedOutput: `Ran 2 tests in 0.001s

OK`,
                lineByLine: [
                  { line: 'with self.assertRaises(ValueError):', explanation: 'Context manager that passes the test if ValueError is raised, and fails if no error or a different error occurs.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Naming test methods without the test_ prefix',
                why: 'The unittest runner automatically discovers and runs methods that start with `test_`. Any method without this prefix will be silently skipped!',
                fix: 'Always name test methods def test_<behavior>(self):.',
                badCode: 'def verify_math(self): # Skipped by runner!',
                goodCode: 'def test_math(self): # Executed!'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-12-1',
          title: 'Lesson 12.1 Knowledge Check',
          moduleId: 'mod-12',
          lessonId: 'les-12-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-12-1-1',
              type: 'mcq',
              question: 'In Python\'s unittest module, what prefix must test method names have to be discovered automatically?',
              options: ['check_', 'test_', 'spec_', 'assert_'],
              correctOptionIndex: 1,
              explanation: '`unittest` test discovery looks for methods beginning with `test_`.'
            },
            {
              id: 'q-12-1-2',
              type: 'mcq',
              question: 'When reading a multi-frame Python traceback, where is the actual error type and description located?',
              options: [
                'At the very top of the output',
                'At the very bottom of the output',
                'In the middle line',
                'In the operating system kernel log'
              ],
              correctOptionIndex: 1,
              explanation: 'The final line of a Python traceback contains the exception class and error message.'
            }
          ]
        }
      },
      {
        id: 'les-12-2',
        moduleId: 'mod-12',
        order: 2,
        title: 'Regular Expressions (re) & Logging vs Print',
        slug: 'regex-and-logging',
        difficulty: 'advanced',
        durationMinutes: 35,
        prerequisites: ['les-12-1'],
        learningObjectives: [
          'Use the re module: re.search, re.findall, re.sub',
          'Master regex patterns: \\d, \\w, \\s, character classes, quantifiers (*, +, ?)',
          'Configure Python\'s logging framework with appropriate severity levels'
        ],
        concepts: ['Regex', 're module', 'Quantifiers', 'Logging Levels', 'PEP 8 Standards'],
        summary: 'Regular expressions find and validate string patterns. The logging module provides structured levels (DEBUG to CRITICAL) with timestamps and module tracking.',
        starterCode: `# 1. Regex validation and extraction
import re
import logging

# Configure basic logging output
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

email_pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$"

def validate_and_log_email(email: str):
    if re.match(email_pattern, email):
        logging.info(f"Email verified successfully: {email}")
        return True
    else:
        logging.warning(f"Malformed email rejected: {email}")
        return False

validate_and_log_email("student@pypath.academy")
validate_and_log_email("not_an_email@@wrong")
`,
        sections: [
          {
            id: 'sec-12-2-1',
            title: 'Why Logging Beats Print for Production',
            content: `Using \`print()\` for debugging and monitoring is common, but in production:
1. **No severity:** You cannot turn off temporary debug prints without manually deleting code.
2. **No metadata:** \`print()\` lacks timestamps, thread IDs, and source file locations.
3. **Logging Levels:**
   - \`DEBUG\`: Detailed diagnostic info.
   - \`INFO\`: Confirmation that things are operating as expected.
   - \`WARNING\`: Indication of an unexpected event or near-future problem.
   - \`ERROR\`: Serious problem preventing a specific function.
   - \`CRITICAL\`: Fatal error causing the application to abort.`,
            codeExamples: [
              {
                title: 'Extracting Information with Regex Groups',
                description: 'Extracting dates formatted as YYYY-MM-DD from raw text.',
                code: `import re

log_entry = "Server rebooted on 2026-09-28 with error code 502"
date_match = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", log_entry)

if date_match:
    year, month, day = date_match.groups()
    print(f"Matched Date -> Year: {year}, Month: {month}, Day: {day}")
`,
                expectedOutput: `Matched Date -> Year: 2026, Month: 09, Day: 28`,
                lineByLine: [
                  { line: 'r"(\\d{4})-(\\d{2})-(\\d{2})"', explanation: 'Raw string with 3 capture groups matching 4 digits, 2 digits, and 2 digits separated by hyphens.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Forgetting raw string prefix r"..." when writing regex',
                why: 'Without the raw string prefix r, Python treats backslashes like \\n and \\d as Python string escape sequences rather than regex tokens.',
                fix: 'Always declare regex patterns with raw strings: r"\\d+".',
                badCode: 'pattern = "\\d+" # May trigger syntax warnings!',
                goodCode: 'pattern = r"\\d+"'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-12-2',
          title: 'Lesson 12.2 Knowledge Check',
          moduleId: 'mod-12',
          lessonId: 'les-12-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-12-2-1',
              type: 'mcq',
              question: 'In regular expressions, what character class matches any numeric digit (0-9)?',
              options: ['\\w', '\\d', '\\s', '\\b'],
              correctOptionIndex: 1,
              explanation: '`\\d` matches any decimal digit [0-9].'
            },
            {
              id: 'q-12-2-2',
              type: 'mcq',
              question: 'Which of the following is the lowest (most verbose) logging level in Python?',
              options: ['INFO', 'DEBUG', 'WARNING', 'CRITICAL'],
              correctOptionIndex: 1,
              explanation: '`DEBUG` is the lowest level, capturing the most granular diagnostic details.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-12',
      title: 'Module 12 Assessment: Practical Engineering',
      moduleId: 'mod-12',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-12-1',
          type: 'mcq',
          question: 'What is PEP 8 in the Python ecosystem?',
          options: [
            'A compiler optimization patch',
            'The official Python Style Guide for code readability and formatting',
            'A database driver',
            'A security encryption standard'
          ],
          correctOptionIndex: 1,
          explanation: 'PEP 8 (Python Enhancement Proposal 8) is the standard style guide for Python code.'
        },
        {
          id: 'cq-12-2',
          type: 'predict-output',
          question: 'What does `re.sub(r"\\s+", "-", "a  b   c")` return?',
          codeSnippet: 'import re\nprint(re.sub(r"\\s+", "-", "a  b   c"))',
          options: ['"a-b-c"', '"a--b---c"', '"abc"', 'None'],
          correctOptionIndex: 0,
          explanation: '`\\s+` matches one or more whitespace characters and replaces each matched group with a single "-", yielding "a-b-c".'
        },
        {
          id: 'cq-12-3',
          type: 'mcq',
          question: 'Which unittest assertion verifies that two floating-point numbers are equal within a specified rounding tolerance?',
          options: ['assertEqual', 'assertAlmostEqual', 'assertTrue', 'assertClose'],
          correctOptionIndex: 1,
          explanation: '`assertAlmostEqual()` accounts for IEEE 754 floating-point rounding precision issues.'
        },
        {
          id: 'cq-12-4',
          type: 'mcq',
          question: 'Why should regex strings always use the `r` raw-string prefix like `r"\\d+"`?',
          options: [
            'It makes the regex run 10x faster.',
            'It prevents Python from interpreting backslashes as string escape sequences.',
            'Raw strings are required by CPython.',
            'It automatically compiles the regex.'
          ],
          correctOptionIndex: 1,
          explanation: 'Raw strings treat backslashes literally so they can be passed to the regex engine intact.'
        },
        {
          id: 'cq-12-5',
          type: 'predict-output',
          question: 'What does `bool(re.search(r"^cat", "concatenate"))` evaluate to?',
          codeSnippet: 'import re\nprint(bool(re.search(r"^cat", "concatenate")))',
          options: ['True', 'False', 'None', 'SyntaxError'],
          correctOptionIndex: 0,
          explanation: 'The `^` anchor asserts the start of the string. Since "concatenate" starts with "cat", it matches and evaluates to True.'
        }
      ]
    }
  }
];
