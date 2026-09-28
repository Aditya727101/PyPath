import { Module } from '../../types/curriculum';

export const modules4_6: Module[] = [
  {
    id: 'mod-4',
    order: 4,
    number: 4,
    title: 'Loops and Iteration',
    slug: 'loops-and-iteration',
    tagline: 'for loops, while loops, range(), loop control statements, and patterns',
    description: 'Master programmatic repetition. Learn to iterate over sequences, execute state-driven while loops, control flow with break/continue/pass, trace loops line-by-line, and avoid infinite loop traps.',
    difficulty: 'beginner',
    iconName: 'Repeat',
    prerequisites: ['mod-3'],
    learningObjectives: [
      'Write bounded for loops and condition-driven while loops',
      'Use range(start, stop, step) with positive and negative step sizes',
      'Control flow precisely using break, continue, and the else loop clause',
      'Identify and diagnose off-by-one errors and infinite loops'
    ],
    estimatedHours: 5,
    lessons: [
      {
        id: 'les-4-1',
        moduleId: 'mod-4',
        order: 1,
        title: 'for Loops, range() Mechanics & Sequence Traversal',
        slug: 'for-loops-and-range',
        difficulty: 'beginner',
        durationMinutes: 25,
        prerequisites: ['les-3-2'],
        learningObjectives: [
          'Understand how for loops iterate over Python iterables',
          'Use the 3 forms of range: range(stop), range(start, stop), range(start, stop, step)',
          'Iterate over strings, lists, and tuples'
        ],
        concepts: ['for ... in', 'range()', 'Iterables', 'Sequence Unpacking'],
        summary: 'In Python, a for loop is a foreach loop that iterates directly through items in any iterable object such as lists, strings, or range generators.',
        starterCode: `# Experimenting with range() step and countdowns
print("Counting by 3s up to 15:")
for num in range(0, 16, 3):
    print(num, end=" ")
print("\\n\\nRocket launch countdown:")
for count in range(5, 0, -1):
    print(count, end="... ")
print("Liftoff! 🚀")
`,
        sections: [
          {
            id: 'sec-4-1-1',
            title: 'The Anatomy of range()',
            content: `The \`range()\` type generates an immutable sequence of numbers on demand (lazy evaluation):
1. **\`range(stop)\`**: Starts at \`0\`, increments by \`1\`, stops at \`stop - 1\`.
2. **\`range(start, stop)\`**: Starts at \`start\`, stops at \`stop - 1\`.
3. **\`range(start, stop, step)\`**: Increments by \`step\`. Can be negative for countdowns!

**Crucial Rule:** The \`stop\` value is **non-inclusive** (exclusive). \`range(1, 5)\` produces \`1, 2, 3, 4\`.`,
            codeExamples: [
              {
                title: 'Enumerating with Index and Value',
                description: 'Using enumerate() instead of manual index counters.',
                code: `languages = ["Python", "Rust", "TypeScript", "Go"]

for index, lang in enumerate(languages, start=1):
    print(f"{index}. {lang}")
`,
                expectedOutput: `1. Python
2. Rust
3. TypeScript
4. Go`,
                lineByLine: [
                  { line: 'enumerate(languages, start=1)', explanation: 'Yields tuples containing (counter, element) starting at the specified index 1.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Expecting range(1, 10) to include the number 10',
                why: 'Python uses half-open intervals [start, stop) across ranges and slices.',
                fix: 'If you need number 10, set stop to 11: range(1, 11).',
                badCode: 'for i in range(1, 10): # stops at 9!',
                goodCode: 'for i in range(1, 11): # includes 10'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-4-1',
          title: 'Lesson 4.1 Knowledge Check',
          moduleId: 'mod-4',
          lessonId: 'les-4-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-4-1-1',
              type: 'predict-output',
              question: 'How many times will this loop execute?',
              codeSnippet: 'for i in range(2, 10, 2):\n    print(i)',
              options: ['4 times (2, 4, 6, 8)', '5 times (2, 4, 6, 8, 10)', '8 times', '0 times'],
              correctOptionIndex: 0,
              explanation: 'The loop visits 2, 4, 6, 8 (4 iterations). 10 is excluded by the stop boundary.'
            },
            {
              id: 'q-4-1-2',
              type: 'predict-output',
              question: 'What is the output of `list(range(5, 0, -2))`?',
              codeSnippet: 'print(list(range(5, 0, -2)))',
              options: ['[5, 3, 1]', '[5, 3, 1, -1]', '[5, 4, 3, 2, 1]', '[]'],
              correctOptionIndex: 0,
              explanation: 'Starting at 5, stepping by -2 until stopping before 0 produces [5, 3, 1].'
            }
          ]
        }
      },
      {
        id: 'les-4-2',
        moduleId: 'mod-4',
        order: 2,
        title: 'while Loops, State Conditions & Loop Tracing',
        slug: 'while-loops-and-tracing',
        difficulty: 'beginner',
        durationMinutes: 30,
        prerequisites: ['les-4-1'],
        learningObjectives: [
          'Design while loops driven by state conditions',
          'Use break to exit early and continue to skip iterations',
          'Understand Python\'s unique `for/while ... else` construct',
          'Trace variable states to debug infinite loops'
        ],
        concepts: ['while', 'break', 'continue', 'Loop else Clause', 'Loop Tracing'],
        summary: 'A while loop executes continuously as long as its conditional expression evaluates to True. break exits the loop immediately, and continue skips to the next iteration.',
        starterCode: `# Tracing a state-driven while loop with break
target = 42
guess = 10
step = 1

while True:
    print(f"Step {step}: current value = {guess}")
    if guess >= target:
        print(f"Goal reached at step {step}!")
        break
    guess += 12
    step += 1
`,
        sections: [
          {
            id: 'sec-4-2-1',
            title: 'Loop Control & The else Clause',
            content: `### \`break\` vs \`continue\` vs \`pass\`:
- **\`break\`**: Terminate the loop immediately and resume execution after the loop.
- **\`continue\`**: Skip the remainder of the current iteration and jump to the next evaluation.
- **\`pass\`**: A placeholder that does nothing.

### Python\'s \`for / while ... else\` Construct:
Python loops have an optional \`else:\` block!
The \`else\` block executes **only if the loop completed normally without hitting a \`break\` statement**. This is ideal for search operations!`,
            codeExamples: [
              {
                title: 'Prime Number Search with for-else',
                description: 'Demonstrating the loop else clause for clean search logic.',
                code: `def check_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            print(f"{n} is not prime (divisible by {i})")
            break
    else:
        print(f"{n} is a PRIME number!")

check_prime(29)
check_prime(35)
`,
                expectedOutput: `29 is a PRIME number!
35 is not prime (divisible by 5)`,
                lineByLine: [
                  { line: 'else:', explanation: 'Belongs to the for loop! Executes only if the loop finishes without executing the break.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Forgetting to update the loop variable in a while loop',
                why: 'If the condition variable never changes inside the loop body, the loop condition remains True indefinitely, freezing the program in an infinite loop.',
                fix: 'Always ensure your loop variable is modified toward the termination condition.',
                badCode: 'i = 0\nwhile i < 5:\n    print(i) # i is never incremented!',
                goodCode: 'i = 0\nwhile i < 5:\n    print(i)\n    i += 1'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-4-2',
          title: 'Lesson 4.2 Knowledge Check',
          moduleId: 'mod-4',
          lessonId: 'les-4-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-4-2-1',
              type: 'predict-output',
              question: 'What is printed by this code?',
              codeSnippet: 'for n in range(5):\n    if n == 2:\n        continue\n    if n == 4:\n        break\n    print(n, end=" ")',
              options: ['0 1 2 3', '0 1 3', '0 1 3 4', '0 1 2 3 4'],
              correctOptionIndex: 1,
              explanation: 'When n==2, continue skips printing. When n==4, break terminates the loop. Numbers printed are: 0, 1, 3.'
            },
            {
              id: 'q-4-2-2',
              type: 'mcq',
              question: 'When does the `else` block of a Python `for` or `while` loop execute?',
              options: [
                'When the loop encounters a break statement.',
                'Whenever the loop body throws an unhandled error.',
                'Only when the loop finishes all iterations without encountering a break statement.',
                'Before the loop begins.'
              ],
              correctOptionIndex: 2,
              explanation: 'The loop `else:` clause executes when the loop naturally terminates (condition becomes false or iterable exhausted) without a `break`.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-4',
      title: 'Module 4 Assessment: Loops and Control Flow',
      moduleId: 'mod-4',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-4-1',
          type: 'predict-output',
          question: 'What is the sum printed by this loop?',
          codeSnippet: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)',
          options: ['10', '15', '4', '14'],
          correctOptionIndex: 0,
          explanation: 'i iterates through 1, 2, 3, 4. Total = 1 + 2 + 3 + 4 = 10.'
        },
        {
          id: 'cq-4-2',
          type: 'predict-output',
          question: 'What does this nested loop print?',
          codeSnippet: 'for i in range(2):\n    for j in range(2):\n        print(f"{i}{j}", end=" ")',
          options: ['00 01 10 11', '01 02 11 12', '00 11', '0 1 0 1'],
          correctOptionIndex: 0,
          explanation: 'Outer loop i=0 -> j=0, 1 (prints "00 01 "). Outer loop i=1 -> j=0, 1 (prints "10 11 ").'
        },
        {
          id: 'cq-4-3',
          type: 'find-bug',
          question: 'Identify the flaw in this while loop:',
          codeSnippet: 'count = 10\nwhile count > 0:\n    print(count)\n    count += 1',
          options: [
            'count must be initialized to 0',
            'Infinite loop: count increments from 10 to infinity, so count > 0 is always True',
            'while syntax requires parentheses',
            'print cannot be used inside while'
          ],
          correctOptionIndex: 1,
          explanation: 'Instead of decrementing `count -= 1`, the code increments `count += 1`, making `count > 0` forever True.'
        },
        {
          id: 'cq-4-4',
          type: 'predict-output',
          question: 'What is the output of `list(range(4))`?',
          codeSnippet: 'print(list(range(4)))',
          options: ['[1, 2, 3, 4]', '[0, 1, 2, 3]', '[0, 1, 2, 3, 4]', '[4]'],
          correctOptionIndex: 1,
          explanation: 'range(4) defaults to start=0 and stops before 4, yielding [0, 1, 2, 3].'
        },
        {
          id: 'cq-4-5',
          type: 'mcq',
          question: 'Which statement immediately exits the current loop, skipping all remaining iterations?',
          options: ['pass', 'continue', 'break', 'return'],
          correctOptionIndex: 2,
          explanation: '`break` terminates the enclosing loop immediately.'
        }
      ]
    }
  },
  {
    id: 'mod-5',
    order: 5,
    number: 5,
    title: 'Strings and Collections',
    slug: 'strings-and-collections',
    tagline: 'String slicing, lists, tuples, sets, dictionaries, and nested data structures',
    description: 'Master Python\'s powerhouse data collections: string manipulation, mutable lists, immutable tuples, hash-based sets, key-value dictionaries, and nested composite structures.',
    difficulty: 'intermediate',
    iconName: 'Layers',
    prerequisites: ['mod-4'],
    learningObjectives: [
      'Master string slicing syntax [start:stop:step] and string methods (split, join, strip, replace)',
      'Perform list operations: append, extend, insert, pop, sort, and slicing',
      'Understand tuple immutability and memory optimization',
      'Leverage sets for O(1) membership lookups and mathematical set operations',
      'Use dictionaries for key-value mappings and safe lookups with get()'
    ],
    estimatedHours: 6,
    lessons: [
      {
        id: 'les-5-1',
        moduleId: 'mod-5',
        order: 1,
        title: 'Strings: Indexing, Slicing & Essential Methods',
        slug: 'string-slicing-and-methods',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-4-2'],
        learningObjectives: [
          'Use positive and negative string indexing',
          'Reverse strings with slicing idiom [::-1]',
          'Format and manipulate strings with split, join, strip, and replace'
        ],
        concepts: ['String Immutability', 'Slicing', 'Negative Indexing', 'split() and join()'],
        summary: 'Strings in Python are immutable sequences of Unicode characters. Slicing with [start:stop:step] provides a concise way to extract substrings.',
        starterCode: `# String slicing and transformation
text = "The quick brown fox jumps over the lazy dog"

# 1. Substring extraction
print("First 9 chars:", text[:9])

# 2. Reverse a string with slice step -1
word = "Python"
print(f"Reversed '{word}':", word[::-1])

# 3. Clean and parse comma-separated data
raw_csv = "  alice@example.com , 29 , Engineer  "
fields = [field.strip() for field in raw_csv.split(",")]
print("Cleaned Fields:", fields)
`,
        sections: [
          {
            id: 'sec-5-1-1',
            title: 'Slicing Notation & Common Methods',
            content: `Slicing formula: \`string[start : stop : step]\`
- If \`start\` is omitted: defaults to \`0\` (or end if step is negative).
- If \`stop\` is omitted: defaults to length of sequence.
- If \`step\` is omitted: defaults to \`1\`.

### Essential String Methods:
- \`.strip()\`: Strips leading and trailing whitespace.
- \`.split(sep)\`: Splices string into a list of strings by delimiter.
- \`sep.join(list_of_strings)\`: Glues list elements into one string.
- \`.replace(old, new)\`: Returns a new string with replacements.
- \`.startswith(prefix)\` and \`.endswith(suffix)\`: Returns boolean.`,
            codeExamples: [
              {
                title: 'Building URLs with join and strip',
                description: 'Using string methods to safely format URL endpoints.',
                code: `base_url = "https://api.pypath.org/"
endpoint = "/v1/courses/"
query = "python-fundamentals"

# Strip extra slashes and join cleanly
clean_parts = [base_url.strip("/"), endpoint.strip("/"), query.strip("/")]
full_url = "/".join(clean_parts)

print("Constructed URL:", full_url)
`,
                expectedOutput: `Constructed URL: https://api.pypath.org/v1/courses/python-fundamentals`,
                lineByLine: [
                  { line: '"/".join(clean_parts)', explanation: 'Joins the three clean strings using a single slash as the glue.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Attempting to mutate a string in-place: s[0] = "H"',
                why: 'Strings in Python are immutable; once allocated in memory, their characters cannot be modified in-place.',
                fix: 'Create a new string using slicing or concatenation.',
                badCode: 'msg = "hello"\nmsg[0] = "H" # TypeError: \'str\' object does not support item assignment',
                goodCode: 'msg = "hello"\nmsg = "H" + msg[1:] # "Hello"'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-5-1',
          title: 'Lesson 5.1 Knowledge Check',
          moduleId: 'mod-5',
          lessonId: 'les-5-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-5-1-1',
              type: 'predict-output',
              question: 'What is the output of `"PyPath"[1:5]`?',
              codeSnippet: 'print("PyPath"[1:5])',
              options: ['yPat', 'yPath', 'PyPa', 'IndexError'],
              correctOptionIndex: 0,
              explanation: 'Indices are 0:P, 1:y, 2:P, 3:a, 4:t, 5:h. Slicing from 1 to 5 (exclusive) extracts characters at index 1, 2, 3, 4: "yPat".'
            },
            {
              id: 'q-5-1-2',
              type: 'predict-output',
              question: 'What is the output of `"-".join(["A", "B", "C"])`?',
              codeSnippet: 'print("-".join(["A", "B", "C"]))',
              options: ['A-B-C-', '-A-B-C', 'A-B-C', '["A-B-C"]'],
              correctOptionIndex: 2,
              explanation: '`join()` places the delimiter between elements, resulting in "A-B-C".'
            }
          ]
        }
      },
      {
        id: 'les-5-2',
        moduleId: 'mod-5',
        order: 2,
        title: 'Lists vs Tuples: Mutability & Methods',
        slug: 'lists-and-tuples',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-5-1'],
        learningObjectives: [
          'Differentiate between mutable lists `[]` and immutable tuples `()`',
          'Use list methods: append, extend, insert, pop, remove, sort',
          'Understand tuple unpacking and memory efficiency'
        ],
        concepts: ['List', 'Tuple', 'Mutability', 'append() vs extend()', 'Unpacking'],
        summary: 'Lists are mutable ordered sequences suitable for collections that grow or change. Tuples are immutable, hashable, and consume less memory.',
        starterCode: `# Compare append() vs extend()
items = [1, 2]
items.append([3, 4]) # Appends the list as a single child element!
print("After append([3, 4]):", items)

items2 = [1, 2]
items2.extend([3, 4]) # Unpacks and appends each element individually
print("After extend([3, 4]):", items2)
`,
        sections: [
          {
            id: 'sec-5-2-1',
            title: 'Lists vs Tuples',
            content: `| Feature | List (\`[...]\`) | Tuple (\`(...)\`) |
| :--- | :--- | :--- |
| **Mutability** | Mutable (can add, remove, change items) | Immutable (frozen upon creation) |
| **Performance** | Slightly slower, over-allocated memory | Faster, compact memory footprint |
| **Dictionary Key** | Cannot be used as dict keys (unhashable) | Can be used as dict keys (if elements are hashable) |
| **Primary Use** | Dynamic homogenous collections | Heterogeneous records, fixed data |`,
            codeExamples: [
              {
                title: 'Tuple Unpacking in Practice',
                description: 'Unpacking geographic coordinates into named variables.',
                code: `coordinate = (37.7749, -122.4194, "San Francisco")
lat, lon, city = coordinate

print(f"City: {city} at Latitude {lat}, Longitude {lon}")
`,
                expectedOutput: `City: San Francisco at Latitude 37.7749, Longitude -122.4194`,
                lineByLine: [
                  { line: 'lat, lon, city = coordinate', explanation: 'Unpacks the 3-element tuple directly into 3 individual identifiers.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Creating a single-element tuple without a trailing comma: (42)',
                why: 'Without a trailing comma, parentheses are interpreted as arithmetic grouping, producing an integer 42, not a tuple!',
                fix: 'Always include a trailing comma for single-item tuples: (42,).',
                badCode: 'single = (42) # type(single) is int!',
                goodCode: 'single = (42,) # type(single) is tuple!'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-5-2',
          title: 'Lesson 5.2 Knowledge Check',
          moduleId: 'mod-5',
          lessonId: 'les-5-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-5-2-1',
              type: 'mcq',
              question: 'Why can a tuple be used as a dictionary key, but a list cannot?',
              options: [
                'Tuples are smaller in byte size.',
                'Tuples are immutable and therefore hashable, while lists are mutable and unhashable.',
                'Python bans square brackets in dictionary keys.',
                'Lists only store numbers.'
              ],
              correctOptionIndex: 1,
              explanation: 'Dictionary keys in Python must be hashable (their hash value must remain constant across their lifetime). Mutable types like lists cannot be hashed.'
            },
            {
              id: 'q-5-2-2',
              type: 'predict-output',
              question: 'What is the output of `nums = [1, 2, 3]; nums.pop(1); print(nums)`?',
              codeSnippet: 'nums = [1, 2, 3]\nnums.pop(1)\nprint(nums)',
              options: ['[2, 3]', '[1, 3]', '[1, 2]', 'IndexError'],
              correctOptionIndex: 1,
              explanation: '`pop(1)` removes the item at index 1 (which is 2), leaving `[1, 3]`.'
            }
          ]
        }
      },
      {
        id: 'les-5-3',
        moduleId: 'mod-5',
        order: 3,
        title: 'Dictionaries & Sets: Hash Maps & Uniqueness',
        slug: 'dictionaries-and-sets',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-5-2'],
        learningObjectives: [
          'Create dictionaries and safely access values using .get(key, default)',
          'Iterate over dictionaries with .keys(), .values(), and .items()',
          'Use sets for O(1) membership testing and set operations (&, |, -, ^)'
        ],
        concepts: ['Hash Table', 'Dictionary', 'Set Operations', '.get()', 'Uniqueness'],
        summary: 'Dictionaries provide O(1) key-value lookups using hash tables. Sets store unique elements with mathematical union, intersection, and difference operations.',
        starterCode: `# Fast deduplication and set intersection
team_a = {"Python", "JavaScript", "Rust", "Go"}
team_b = {"C++", "Rust", "Python", "Kotlin"}

common_skills = team_a & team_b # Set intersection
all_skills = team_a | team_b    # Set union

print("Shared skills:", common_skills)
print("Unique total skills:", all_skills)
`,
        sections: [
          {
            id: 'sec-5-3-1',
            title: 'Dictionaries & Safe Lookups',
            content: `Dictionaries map unique, hashable keys to values.
\`\`\`python
student = {"name": "Alex", "course": "Python", "marks": 94}
\`\`\`

### Why You Should Use \`.get()\`:
- Accessing \`student["gpa"]\` raises a **\`KeyError\`** if the key doesn\'t exist.
- Accessing \`student.get("gpa", 4.0)\` safely returns the fallback \`4.0\` without crashing!`,
            codeExamples: [
              {
                title: 'Frequency Counter Using Dictionary',
                description: 'Counting word frequencies with dictionary get().',
                code: `words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
frequency = {}

for w in words:
    frequency[w] = frequency.get(w, 0) + 1

for fruit, count in frequency.items():
    print(f"{fruit}: {count}")
`,
                expectedOutput: `apple: 3
banana: 2
cherry: 1`,
                lineByLine: [
                  { line: 'frequency.get(w, 0)', explanation: 'Retrieves current count for word w, or 0 if w has not been seen yet.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Creating an empty set with {}',
                why: 'In Python, `{}` creates an empty dictionary, not an empty set!',
                fix: 'Use set() to create an empty set.',
                badCode: 's = {} # type(s) is dict!',
                goodCode: 's = set() # type(s) is set!'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-5-3',
          title: 'Lesson 5.3 Knowledge Check',
          moduleId: 'mod-5',
          lessonId: 'les-5-3',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-5-3-1',
              type: 'predict-output',
              question: 'What is the value of `len(set([1, 2, 2, 3, 3, 3]))`?',
              codeSnippet: 'print(len(set([1, 2, 2, 3, 3, 3])))',
              options: ['6', '3', '1', 'TypeError'],
              correctOptionIndex: 1,
              explanation: 'Sets enforce uniqueness. The set contains {1, 2, 3}, which has a length of 3.'
            },
            {
              id: 'q-5-3-2',
              type: 'predict-output',
              question: 'What does `{"a": 1}.get("b", 100)` return?',
              codeSnippet: 'print({"a": 1}.get("b", 100))',
              options: ['None', 'KeyError', '100', '1'],
              correctOptionIndex: 2,
              explanation: 'Since key "b" does not exist in the dictionary, get() returns the specified default 100.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-5',
      title: 'Module 5 Assessment: Strings and Collections',
      moduleId: 'mod-5',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-5-1',
          type: 'predict-output',
          question: 'What is the output of `"Programming"[::-1]`?',
          codeSnippet: 'print("Programming"[::-1])',
          options: ['gnimmargorP', 'Programming', 'IndexError', 'gnimmargor'],
          correctOptionIndex: 0,
          explanation: 'The slice `[::-1]` reverses the sequence from start to end with step -1, producing "gnimmargorP".'
        },
        {
          id: 'cq-5-2',
          type: 'mcq',
          question: 'Which method adds all items from an iterable into an existing list?',
          options: ['append()', 'extend()', 'push()', 'insertAll()'],
          correctOptionIndex: 1,
          explanation: '`extend()` iterates over its argument and appends each element individually, whereas `append()` adds the argument as a single object.'
        },
        {
          id: 'cq-5-3',
          type: 'predict-output',
          question: 'What does `print({1, 2, 3} & {2, 3, 4})` evaluate to?',
          codeSnippet: 'print({1, 2, 3} & {2, 3, 4})',
          options: ['{1, 2, 3, 4}', '{2, 3}', '{1, 4}', 'True'],
          correctOptionIndex: 1,
          explanation: 'The `&` operator computes the set intersection: elements present in both sets, which are {2, 3}.'
        },
        {
          id: 'cq-5-4',
          type: 'find-bug',
          question: 'Why does this code throw an exception?',
          codeSnippet: 'd = {"name": "Alice"}\nprint(d["age"])',
          options: [
            'Missing quotes',
            'KeyError: "age" does not exist in the dictionary',
            'd is not a valid dictionary',
            'print cannot display dictionary lookups'
          ],
          correctOptionIndex: 1,
          explanation: 'Square-bracket key access raises a `KeyError` when the key is absent. Use `d.get("age")` for safe access.'
        },
        {
          id: 'cq-5-5',
          type: 'predict-output',
          question: 'What is the output of `print(type({}))`?',
          codeSnippet: 'print(type({}))',
          options: ["<class 'set'>", "<class 'dict'>", "<class 'list'>", "<class 'object'>"],
          correctOptionIndex: 1,
          explanation: 'Empty curly braces `{}` define an empty dictionary in Python. To create an empty set, you must use `set()`.'
        }
      ]
    }
  },
  {
    id: 'mod-6',
    order: 6,
    number: 6,
    title: 'Functions and Modular Code',
    slug: 'functions-and-modular-code',
    tagline: 'Parameters, return values, *args, **kwargs, scope, lambdas, and recursion',
    description: 'Structure reusable, maintainable code with functions. Master positional and keyword arguments, variadic *args and **kwargs, LEGB variable scoping, first-class functions, lambdas, and recursive algorithms.',
    difficulty: 'intermediate',
    iconName: 'Code2',
    prerequisites: ['mod-5'],
    learningObjectives: [
      'Define modular, documented functions with docstrings and type hints',
      'Distinguish positional, keyword, and default parameters',
      'Use *args for variable positional arguments and **kwargs for keyword dictionaries',
      'Understand the LEGB scoping rule (Local, Enclosing, Global, Built-in)',
      'Construct recursive functions with explicit base cases'
    ],
    estimatedHours: 6,
    lessons: [
      {
        id: 'les-6-1',
        moduleId: 'mod-6',
        order: 1,
        title: 'Defining Functions, Parameters & Return Mechanics',
        slug: 'defining-functions-and-parameters',
        difficulty: 'intermediate',
        durationMinutes: 25,
        prerequisites: ['les-5-3'],
        learningObjectives: [
          'Declare functions using def and return values',
          'Use default parameter values correctly',
          'Avoid the infamous mutable default argument trap'
        ],
        concepts: ['def', 'return', 'Default Arguments', 'Mutable Default Trap', 'Docstrings'],
        summary: 'Functions encapsulate reusable logic. If a function reaches its end without an explicit return statement, Python automatically returns None.',
        starterCode: `# Clean function with docstrings and default arguments
def calculate_tax(income: float, rate: float = 0.20) -> float:
    """Calculate the net tax amount for a given gross income."""
    if income <= 0:
        return 0.0
    return round(income * rate, 2)

print("Tax on $50,000 at default 20%:", calculate_tax(50000))
print("Tax on $80,000 at custom 28%:", calculate_tax(80000, 0.28))
`,
        sections: [
          {
            id: 'sec-6-1-1',
            title: 'Function Definition & The Mutable Default Trap',
            content: `In Python, default parameter expressions are evaluated **once at function definition time**, not each time the function is called!

If you use a mutable object (like a list or dictionary) as a default parameter, all subsequent calls that omit the parameter will share the **exact same object**!

### The Idiomatic Solution:
Always use \`None\` as the default value for mutable arguments:
\`\`\`python
def append_item(item, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list
\`\`\``,
            codeExamples: [
              {
                title: 'Demonstrating the Mutable Default Trap',
                description: 'Watch how an unexpected shared list persists across calls.',
                code: `# BUGGY: shared list across calls
def buggy_logger(msg, log_entries=[]):
    log_entries.append(msg)
    return log_entries

print("Call 1:", buggy_logger("System startup"))
print("Call 2:", buggy_logger("User logged in")) # Retains previous call's data!
`,
                expectedOutput: `Call 1: ['System startup']
Call 2: ['System startup', 'User logged in']`,
                lineByLine: [
                  { line: 'log_entries=[]', explanation: 'The list is instantiated once when Python compiles the function definition. Every invocation re-uses this same list!' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Using [] or {} as a default argument',
                why: 'Mutable defaults are shared across calls, causing bizarre state leaks and hard-to-track bugs.',
                fix: 'Default to None and initialize inside the function.',
                badCode: 'def add_task(task, tasks=[]): tasks.append(task); return tasks',
                goodCode: 'def add_task(task, tasks=None):\n    if tasks is None:\n        tasks = []\n    tasks.append(task)\n    return tasks'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-6-1',
          title: 'Lesson 6.1 Knowledge Check',
          moduleId: 'mod-6',
          lessonId: 'les-6-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-6-1-1',
              type: 'predict-output',
              question: 'What does a Python function return if it contains no `return` statement?',
              codeSnippet: 'def greet():\n    print("Hi")\nres = greet()\nprint(res)',
              options: ['0', 'None', 'False', '""'],
              correctOptionIndex: 1,
              explanation: 'In Python, functions without an explicit return statement implicitly return `None`.'
            },
            {
              id: 'q-6-1-2',
              type: 'mcq',
              question: 'When is a default argument evaluated in Python?',
              options: [
                'Every time the function is called.',
                'Only once when the function definition is executed/compiled.',
                'When the garbage collector runs.',
                'Only if the caller explicitly supplies None.'
              ],
              correctOptionIndex: 1,
              explanation: 'Default arguments are evaluated once at function definition time. This is why mutable defaults retain modifications across calls.'
            }
          ]
        }
      },
      {
        id: 'les-6-2',
        moduleId: 'mod-6',
        order: 2,
        title: '*args, **kwargs & Variable Scoping (LEGB)',
        slug: 'args-kwargs-and-scope',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-6-1'],
        learningObjectives: [
          'Accept arbitrary positional arguments with *args (tuple)',
          'Accept arbitrary keyword arguments with **kwargs (dictionary)',
          'Understand LEGB scope resolution: Local -> Enclosing -> Global -> Built-in'
        ],
        concepts: ['*args', '**kwargs', 'LEGB Rule', 'global keyword', 'nonlocal keyword'],
        summary: '*args collects extra positional arguments into a tuple, while **kwargs collects extra keyword arguments into a dictionary.',
        starterCode: `# Flexible wrapper using *args and **kwargs
def universal_logger(action, *args, **kwargs):
    print(f"[ACTION: {action}]")
    if args:
        print(f"  Positional: {args}")
    if kwargs:
        print(f"  Keyword options: {kwargs}")

universal_logger("USER_SIGNIN", "Alex", "192.168.1.1", role="student", verified=True)
`,
        sections: [
          {
            id: 'sec-6-2-1',
            title: 'Variable Scope: The LEGB Rule',
            content: `When Python resolves a variable name, it checks four scopes in strict order:
1. **L — Local:** Names assigned inside the current function.
2. **E — Enclosing:** Names in enclosing functions (closures).
3. **G — Global:** Names assigned at the top-level of the module.
4. **B — Built-in:** Pre-assigned names in Python (\`print\`, \`len\`, \`range\`, etc.).

If Python cannot find the variable in any of these four tiers, it raises a **\`NameError\`**.`,
            codeExamples: [
              {
                title: 'Forwarding Arguments with *args and **kwargs',
                description: 'Decorator and wrapper functions use *args, **kwargs to stay agnostic of the wrapped signature.',
                code: `def calculate_volume(length, width, height):
    return length * width * height

def logged_calculation(func, *args, **kwargs):
    print(f"Executing {func.__name__} with args={args}, kwargs={kwargs}")
    return func(*args, **kwargs)

result = logged_calculation(calculate_volume, 2, 3, height=4)
print("Volume:", result)
`,
                expectedOutput: `Executing calculate_volume with args=(2, 3), kwargs={'height': 4}
Volume: 24`,
                lineByLine: [
                  { line: 'func(*args, **kwargs)', explanation: 'Unpacks tuple args into positional arguments and dictionary kwargs into keyword arguments.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Modifying a global variable inside a function without the `global` declaration',
                why: 'Assigning to a variable inside a function causes Python to treat it as local, raising UnboundLocalError if referenced prior to assignment.',
                fix: 'Declare `global var_name` if you must modify a module-level variable (or better yet, pass and return values).',
                badCode: 'count = 0\ndef bump():\n    count += 1 # UnboundLocalError!',
                goodCode: 'count = 0\ndef bump():\n    global count\n    count += 1'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-6-2',
          title: 'Lesson 6.2 Knowledge Check',
          moduleId: 'mod-6',
          lessonId: 'les-6-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-6-2-1',
              type: 'mcq',
              question: 'Inside a function definition `def f(*args):`, what data type is `args`?',
              options: ['list', 'tuple', 'dict', 'set'],
              correctOptionIndex: 1,
              explanation: '`*args` bundles positional arguments into an immutable `tuple`.'
            },
            {
              id: 'q-6-2-2',
              type: 'mcq',
              question: 'Inside a function definition `def f(**kwargs):`, what data type is `kwargs`?',
              options: ['list', 'tuple', 'dict', 'generator'],
              correctOptionIndex: 2,
              explanation: '`**kwargs` collects keyword arguments into a standard Python `dict`.'
            }
          ]
        }
      },
      {
        id: 'les-6-3',
        moduleId: 'mod-6',
        order: 3,
        title: 'Lambdas & Recursion with Worked Traces',
        slug: 'lambdas-and-recursion',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-6-2'],
        learningObjectives: [
          'Write concise anonymous lambda expressions for sorting and mapping',
          'Understand recursion mechanics: base case vs recursive step',
          'Trace stack frames for recursive algorithms (Factorial, Fibonacci)'
        ],
        concepts: ['lambda', 'Recursion', 'Call Stack', 'Base Case', 'Stack Overflow'],
        summary: 'A recursive function calls itself to solve smaller subproblems until it reaches a terminating base case. Every recursive call adds a stack frame to memory.',
        starterCode: `# Recursive factorial with stack trace visualization
def factorial(n, depth=0):
    indent = "  " * depth
    print(f"{indent}-> factorial({n}) entered")
    
    # 1. Base case
    if n <= 1:
        print(f"{indent}<- base case hit, returning 1")
        return 1
    
    # 2. Recursive step
    sub_res = factorial(n - 1, depth + 1)
    result = n * sub_res
    print(f"{indent}<- factorial({n}) computed: {n} * {sub_res} = {result}")
    return result

print("\\nFinal result:", factorial(4))
`,
        sections: [
          {
            id: 'sec-6-3-1',
            title: 'Recursion Rules: The Two Invariants',
            content: `Every valid recursive algorithm **MUST** have two components:
1. **Base Case:** A terminating condition that stops recursion without making another self-call.
2. **Recursive Step:** Progresses toward the base case with a smaller input.

Without a base case, recursion executes until Python hits its recursion limit (default 1,000 frames), crashing with **\`RecursionError: maximum recursion depth exceeded\`**.`,
            codeExamples: [
              {
                title: 'Sorting with Lambdas',
                description: 'Sorting a list of dictionaries using a lambda key selector.',
                code: `students = [
    {"name": "Zoe", "grade": 88},
    {"name": "Bob", "grade": 95},
    {"name": "Charlie", "grade": 72}
]

# Sort descending by grade
students.sort(key=lambda s: s["grade"], reverse=True)

for st in students:
    print(f"{st['name']}: {st['grade']}")
`,
                expectedOutput: `Bob: 95
Zoe: 88
Charlie: 72`,
                lineByLine: [
                  { line: 'key=lambda s: s["grade"]', explanation: 'An anonymous inline function that extracts the "grade" value from each dictionary item for comparison.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Forgetting the base case in a recursive function',
                why: 'Without a base case, the function calls itself indefinitely, exhausting memory.',
                fix: 'Always write and verify your base case before writing recursive logic.',
                badCode: 'def countdown(n):\n    print(n)\n    countdown(n - 1) # Never terminates!',
                goodCode: 'def countdown(n):\n    if n <= 0:\n        return\n    print(n)\n    countdown(n - 1)'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-6-3',
          title: 'Lesson 6.3 Knowledge Check',
          moduleId: 'mod-6',
          lessonId: 'les-6-3',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-6-3-1',
              type: 'predict-output',
              question: 'What is the output of `f = lambda a, b: a * b + 2; print(f(3, 4))`?',
              codeSnippet: 'f = lambda a, b: a * b + 2\nprint(f(3, 4))',
              options: ['14', '18', '24', 'SyntaxError'],
              correctOptionIndex: 0,
              explanation: '3 * 4 = 12. 12 + 2 = 14.'
            },
            {
              id: 'q-6-3-2',
              type: 'mcq',
              question: 'What occurs when a recursive function in Python has no terminating base case?',
              options: [
                'It runs forever without error.',
                'It raises RecursionError: maximum recursion depth exceeded.',
                'It returns None.',
                'The operating system reboots.'
              ],
              correctOptionIndex: 1,
              explanation: 'Python raises `RecursionError` once the call stack reaches the recursion limit (usually 1000).'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-6',
      title: 'Module 6 Assessment: Functions',
      moduleId: 'mod-6',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-6-1',
          type: 'predict-output',
          question: 'What does this code print?',
          codeSnippet: 'def add(a, b=5):\n    return a + b\nprint(add(3), add(3, 2))',
          options: ['8 5', '5 5', '8 8', 'TypeError'],
          correctOptionIndex: 0,
          explanation: '`add(3)` uses default b=5, yielding 8. `add(3, 2)` overrides b=2, yielding 5.'
        },
        {
          id: 'cq-6-2',
          type: 'mcq',
          question: 'What does the LEGB acronym stand for in Python variable resolution?',
          options: [
            'Literal, Execution, Global, Base',
            'Local, Enclosing, Global, Built-in',
            'Logical, Evaluated, Generic, Bound',
            'Loop, Entry, Guard, Branch'
          ],
          correctOptionIndex: 1,
          explanation: 'LEGB stands for Local -> Enclosing -> Global -> Built-in scopes.'
        },
        {
          id: 'cq-6-3',
          type: 'predict-output',
          question: 'What is the output of this variadic function?',
          codeSnippet: 'def total(*nums):\n    return sum(nums)\nprint(total(1, 2, 3, 4))',
          options: ['10', '(1, 2, 3, 4)', '[1, 2, 3, 4]', 'TypeError'],
          correctOptionIndex: 0,
          explanation: '`*nums` packs the inputs into tuple `(1, 2, 3, 4)`. `sum()` computes 10.'
        },
        {
          id: 'cq-6-4',
          type: 'find-bug',
          question: 'Why is defining `def append_item(x, lst=[]):` dangerous in production Python?',
          options: [
            'Python does not allow list default values',
            'The default list is instantiated once at function definition, meaning all invocations without an argument share and mutate the same list',
            'lst will automatically be converted to a tuple',
            'It causes a SyntaxError'
          ],
          correctOptionIndex: 1,
          explanation: 'Default arguments are evaluated once at definition time, so mutable default values retain mutations across calls.'
        },
        {
          id: 'cq-6-5',
          type: 'predict-output',
          question: 'What is printed by: `print((lambda x: x ** 2)(5))`?',
          codeSnippet: 'print((lambda x: x ** 2)(5))',
          options: ['25', '10', 'None', 'SyntaxError'],
          correctOptionIndex: 0,
          explanation: 'The anonymous lambda takes x=5 and returns `5 ** 2 = 25`.'
        }
      ]
    }
  }
];
