import { Module } from '../../types/curriculum';

export const modules7_9: Module[] = [
  {
    id: 'mod-7',
    order: 7,
    number: 7,
    title: 'Modules and Packages',
    slug: 'modules-and-packages',
    tagline: 'Standard library, namespaces, package design, pip, and virtual environments',
    description: 'Learn how to architect clean multi-file Python applications. Master Python\'s "batteries-included" standard library (math, random, datetime), create your own reusable modules, understand __init__.py and packaging, and manage dependencies with venv and pip.',
    difficulty: 'intermediate',
    iconName: 'Package',
    prerequisites: ['mod-6'],
    learningObjectives: [
      'Import modules safely using import, from ... import, and as alias syntax',
      'Use built-in modules: math, random, datetime, and sys',
      'Understand __name__ == "__main__" execution guard',
      'Structure Python packages using folders and __init__.py',
      'Create and activate isolated virtual environments with python -m venv'
    ],
    estimatedHours: 5,
    lessons: [
      {
        id: 'les-7-1',
        moduleId: 'mod-7',
        order: 1,
        title: 'Import Mechanics & Standard Library Powerhouses',
        slug: 'import-mechanics-and-stdlib',
        difficulty: 'intermediate',
        durationMinutes: 25,
        prerequisites: ['les-6-3'],
        learningObjectives: [
          'Master import syntaxes and namespace collision avoidance',
          'Use math for mathematical functions and constants (pi, sqrt, ceil)',
          'Generate pseudo-random values with random (choice, shuffle, randint)',
          'Manipulate timestamps and dates with datetime'
        ],
        concepts: ['import', 'from ... import', 'math', 'random', 'datetime', 'Wildcard Imports'],
        summary: 'Python includes dozens of pre-installed modules in its standard library. Importing them cleanly into your namespace enables production-grade math, randomness, and date calculations without external libraries.',
        starterCode: `# Exploring math, random, and datetime
import math
import random
from datetime import datetime, timedelta

# 1. Math calculations
hypotenuse = math.hypot(3, 4)
print(f"Hypotenuse of 3 and 4: {hypotenuse}")

# 2. Random selection
lucky_number = random.randint(1, 100)
chosen_color = random.choice(["Emerald", "Indigo", "Amber", "Sapphire"])
print(f"Random: {lucky_number} | Color: {chosen_color}")

# 3. Dates and Deltas
today = datetime.now()
future_date = today + timedelta(days=30)
print(f"Today: {today.strftime('%Y-%m-%d')}")
print(f"30 Days from now: {future_date.strftime('%Y-%m-%d')}")
`,
        sections: [
          {
            id: 'sec-7-1-1',
            title: 'Namespace Hygiene: Why `from module import *` is an Anti-Pattern',
            content: `Wildcard imports (\`from math import *\`) pollute your local namespace by dumping hundreds of identifiers without tracking their origin. This causes:
1. **Silent name shadowing:** If you had a function named \`sin\` or \`pow\`, it gets silently overwritten!
2. **Loss of readability:** Code readers and linters cannot identify where functions originated.

### Recommended PEP 8 Import Formats:
\`\`\`python
# Format 1: Explicit module import (Best practice)
import math
area = math.pi * (radius ** 2)

# Format 2: Specific identifier import
from datetime import datetime, timezone

# Format 3: Aliasing long names
import numpy as np
\`\`\``,
            codeExamples: [
              {
                title: 'Working with Datetime & Time Zones',
                description: 'Formatting timestamps according to ISO standards.',
                code: `from datetime import datetime

now = datetime.now()
formatted = now.strftime("%A, %B %d, %Y at %I:%M %p")
print("Human timestamp:", formatted)
print("ISO format:     ", now.isoformat())
`,
                expectedOutput: `Human timestamp: Monday, September 28, 2026 at 05:30 AM
ISO format:      2026-09-28T05:30:00.000000`,
                lineByLine: [
                  { line: 'now.strftime(...)', explanation: 'String format time: formats a datetime object according to format codes (%A=Day, %B=Month, %d=Date, %Y=Year).' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Naming your own script math.py or random.py',
                why: 'When you run `import math`, Python checks the current working directory first. If a file named `math.py` exists, Python imports your script instead of the standard library, leading to mysterious AttributeError exceptions!',
                fix: 'Never name your scripts after standard library modules.',
                badCode: '# File: random.py\nimport random # circular self-import!',
                goodCode: '# File: dice_roller.py\nimport random'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-7-1',
          title: 'Lesson 7.1 Knowledge Check',
          moduleId: 'mod-7',
          lessonId: 'les-7-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-7-1-1',
              type: 'mcq',
              question: 'Why does PEP 8 advise against `from module import *`?',
              options: [
                'It slows down computer boot time.',
                'It pollutes the local namespace and risks silent name collisions.',
                'It is deprecated in Python 3.',
                'Python only permits importing one function at a time.'
              ],
              correctOptionIndex: 1,
              explanation: 'Wildcard imports obscure the origins of variables and can silently overwrite identically named variables.'
            },
            {
              id: 'q-7-1-2',
              type: 'predict-output',
              question: 'What is the value of `math.floor(4.99)` in Python?',
              codeSnippet: 'import math\nprint(math.floor(4.99))',
              options: ['5', '4', '4.0', '5.0'],
              correctOptionIndex: 1,
              explanation: '`math.floor(x)` returns the greatest integer less than or equal to x, which is 4.'
            }
          ]
        }
      },
      {
        id: 'les-7-2',
        moduleId: 'mod-7',
        order: 2,
        title: 'Custom Modules & The __name__ == "__main__" Idiom',
        slug: 'custom-modules-and-main-idiom',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-7-1'],
        learningObjectives: [
          'Understand how Python searches for modules in sys.path',
          'Use if __name__ == "__main__": to write dual-use scripts (executable and importable)',
          'Create packages with __init__.py files'
        ],
        concepts: ['__name__', '__main__', 'sys.path', 'Packages', '__init__.py'],
        summary: 'When a Python file is run directly, its __name__ variable is set to "__main__". When imported by another script, __name__ is set to the module\'s file name.',
        starterCode: `# Inspecting module identity
import sys

print(f"Current module name: {__name__}")
print(f"Number of sys.path search locations: {len(sys.path)}")

def standalone_utility():
    return "Utility logic executed!"

if __name__ == "__main__":
    print("This file was EXECUTED DIRECTLY from the command line!")
    print(standalone_utility())
else:
    print("This file was IMPORTED by another module!")
`,
        sections: [
          {
            id: 'sec-7-2-1',
            title: 'Why `if __name__ == "__main__":` is Essential',
            content: `When you create a module \`geometry.py\` that provides helper functions (\`calculate_circle_area\`, \`hypotenuse\`), you might want to write test or demo code at the bottom.

If you don\'t wrap that test code inside \`if __name__ == "__main__":\`, **any other file that imports \`geometry\` will immediately execute your test code!**

With the guard:
\`\`\`python
# geometry.py
def circle_area(radius):
    return 3.14159 * radius * radius

if __name__ == "__main__":
    # Runs ONLY when you run: python geometry.py
    # Does NOT run when someone does: import geometry
    print("Self-test circle_area(5):", circle_area(5))
\`\`\``,
            codeExamples: [
              {
                title: 'Dual-Use Module Architecture',
                description: 'Functions ready for import with self-contained CLI entry points.',
                code: `def celsius_to_fahrenheit(celsius: float) -> float:
    return (celsius * 9/5) + 32

def fahrenheit_to_celsius(fahrenheit: float) -> float:
    return (fahrenheit - 32) * 5/9

if __name__ == "__main__":
    c = 100
    print(f"Test run: {c}°C is {celsius_to_fahrenheit(c)}°F")
`,
                expectedOutput: `Test run: 100°C is 212.0°F`,
                lineByLine: [
                  { line: 'if __name__ == "__main__":', explanation: 'Guarantees the test code only runs when the script is directly executed.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Top-level executable code in an importable library',
                why: 'Placing raw calculations or print statements at the root level of a module causes them to trigger whenever any other file imports that module.',
                fix: 'Always put module demonstration and test code inside if __name__ == "__main__":.',
                badCode: '# utils.py\nprint("Connecting to DB...") # Runs on every import!',
                goodCode: '# utils.py\nif __name__ == "__main__":\n    print("Running diagnostic tests...")'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-7-2',
          title: 'Lesson 7.2 Knowledge Check',
          moduleId: 'mod-7',
          lessonId: 'les-7-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-7-2-1',
              type: 'mcq',
              question: 'What is the value of `__name__` inside a script that is executed directly via `python script.py`?',
              options: ['"__main__"', '"script"', '"root"', '"__init__"'],
              correctOptionIndex: 0,
              explanation: 'Python assigns the special string `"__main__"` to the `__name__` variable of the entry-point script.'
            },
            {
              id: 'q-7-2-2',
              type: 'mcq',
              question: 'What file in a directory signals to Python that the folder should be treated as a package?',
              options: ['package.json', '__init__.py', 'main.py', '__config__.py'],
              correctOptionIndex: 1,
              explanation: '`__init__.py` marks a directory as a Python package and initializes package-level variables.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-7',
      title: 'Module 7 Assessment: Modules & Packages',
      moduleId: 'mod-7',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-7-1',
          type: 'mcq',
          question: 'What command creates a new isolated virtual environment in modern Python?',
          options: ['pip install venv', 'python -m venv .venv', 'npm init env', 'python --create-env'],
          correctOptionIndex: 1,
          explanation: '`python -m venv <directory>` uses Python\'s built-in venv module to create an isolated environment.'
        },
        {
          id: 'cq-7-2',
          type: 'predict-output',
          question: 'What does `random.choice(["X", "X", "X"])` return?',
          codeSnippet: 'import random\nprint(random.choice(["X", "X", "X"]))',
          options: ['"X"', '["X"]', '0', 'None'],
          correctOptionIndex: 0,
          explanation: '`random.choice()` picks a single random element from the non-empty sequence, returning "X".'
        },
        {
          id: 'cq-7-3',
          type: 'mcq',
          question: 'Where does Python look for modules when you run an import statement?',
          options: [
            'Only in the operating system root folder',
            'In the list of directories defined in sys.path',
            'Exclusively on GitHub',
            'In browser localStorage'
          ],
          correctOptionIndex: 1,
          explanation: 'Python searches directories listed in `sys.path` (including the current directory, PYTHONPATH, and site-packages).'
        },
        {
          id: 'cq-7-4',
          type: 'mcq',
          question: 'What file stores pinned project dependencies for pip?',
          options: ['requirements.txt', 'dependencies.xml', 'pip.config', 'packages.py'],
          correctOptionIndex: 0,
          explanation: '`requirements.txt` is the standard pip dependency manifest.'
        },
        {
          id: 'cq-7-5',
          type: 'predict-output',
          question: 'What is printed by: `import math; print(math.ceil(2.01))`?',
          codeSnippet: 'import math\nprint(math.ceil(2.01))',
          options: ['2', '3', '2.0', '3.0'],
          correctOptionIndex: 1,
          explanation: '`math.ceil()` rounds upwards to the nearest integer, so 2.01 becomes 3.'
        }
      ]
    }
  },
  {
    id: 'mod-8',
    order: 8,
    number: 8,
    title: 'File Handling and Exception Management',
    slug: 'file-handling-and-exceptions',
    tagline: 'Context managers, text/JSON/CSV processing, try-except-else-finally, and custom exceptions',
    description: 'Build crash-resilient Python software. Master file input/output using the with context manager, parse structured JSON and CSV formats, and handle errors professionally using try, except, else, finally, and custom exception classes.',
    difficulty: 'intermediate',
    iconName: 'FileText',
    prerequisites: ['mod-7'],
    learningObjectives: [
      'Read and write text files using open() and the with statement',
      'Parse, serialize, and validate JSON data with json.loads() and json.dumps()',
      'Process tabular records with the csv module',
      'Construct complete exception handlers using try, except, else, and finally',
      'Create custom domain exception hierarchies inheriting from Exception'
    ],
    estimatedHours: 6,
    lessons: [
      {
        id: 'les-8-1',
        moduleId: 'mod-8',
        order: 1,
        title: 'File I/O & The `with` Context Manager',
        slug: 'file-io-and-context-managers',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-7-2'],
        learningObjectives: [
          'Understand file access modes: "r" (read), "w" (overwrite), "a" (append)',
          'Explain why the `with` statement prevents file descriptor leaks',
          'Process text files line-by-line using memory-efficient generators'
        ],
        concepts: ['open()', 'with statement', 'Context Manager', 'File Modes', 'Buffer Flushing'],
        summary: 'The `with open(...)` construct guarantees that file streams are properly closed and flushed immediately upon exiting the block, even if an unhandled exception occurs.',
        starterCode: `# In-memory string stream simulation demonstrating file reading/writing
import io

# We simulate a file stream using io.StringIO
virtual_file = io.StringIO()
virtual_file.write("Student,Grade,Status\\n")
virtual_file.write("Alice,94,Pass\\n")
virtual_file.write("Bob,88,Pass\\n")

# Rewind pointer to beginning to read
virtual_file.seek(0)

print("Reading lines from stream:")
for line_number, line in enumerate(virtual_file, start=1):
    print(f"Line {line_number}: {line.strip()}")
`,
        sections: [
          {
            id: 'sec-8-1-1',
            title: 'Always Use the `with` Statement',
            content: `In early Python, programmers wrote:
\`\`\`python
f = open("data.txt", "w")
f.write("Important record")
f.close() # If an error happened above this, close() NEVER RAN!
\`\`\`

If an error occurred before \`close()\`, the file handle remained open in operating system memory, causing file locks and data corruption.

### The Idiomatic Way:
\`\`\`python
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("Important record\\n")
# Guaranteed to close automatically here!
\`\`\``,
            codeExamples: [
              {
                title: 'Parsing and Formatting JSON Data',
                description: 'Serializing Python dictionaries to JSON strings and parsing them back.',
                code: `import json

profile = {
    "user_id": 1042,
    "username": "CodeNinja",
    "enrolled_courses": ["Python Fundamentals", "Algorithms"],
    "is_active": True
}

# Serialize dictionary to JSON string with pretty formatting
json_string = json.dumps(profile, indent=2)
print("Serialized JSON:\\n", json_string)

# Deserialize back into native Python dict
restored = json.loads(json_string)
print("\\nRestored user:", restored["username"])
print("Course count: ", len(restored["enrolled_courses"]))
`,
                expectedOutput: `Serialized JSON:
 {
  "user_id": 1042,
  "username": "CodeNinja",
  "enrolled_courses": [
    "Python Fundamentals",
    "Algorithms"
  ],
  "is_active": true
}

Restored user: CodeNinja
Course count:  2`,
                lineByLine: [
                  { line: 'json.dumps(profile, indent=2)', explanation: 'Serializes Python data types into a formatted JSON string (converting True to lower-case true).' },
                  { line: 'json.loads(json_string)', explanation: 'Parses a JSON string and converts it back into Python dictionaries and lists.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Opening files in write mode ("w") accidentally truncating existing data',
                why: '"w" mode immediately erases and truncates the file to 0 bytes upon opening!',
                fix: 'Use append mode ("a") if you want to add new content to the end of an existing file.',
                badCode: 'open("system_log.txt", "w") # Erases existing logs!',
                goodCode: 'open("system_log.txt", "a") # Preserves and appends'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-8-1',
          title: 'Lesson 8.1 Knowledge Check',
          moduleId: 'mod-8',
          lessonId: 'les-8-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-8-1-1',
              type: 'mcq',
              question: 'What is the primary advantage of the `with open(...)` construct in Python?',
              options: [
                'It accelerates hard drive read speeds.',
                'It guarantees the file is closed automatically when exiting the block, even if exceptions occur.',
                'It automatically translates text to uppercase.',
                'It allows files to be stored without file extensions.'
              ],
              correctOptionIndex: 1,
              explanation: 'Context managers ensure the `__exit__` cleanup method is executed regardless of normal termination or errors.'
            },
            {
              id: 'q-8-1-2',
              type: 'predict-output',
              question: 'Which method converts a Python dictionary into a JSON string?',
              options: ['json.dump()', 'json.dumps()', 'json.load()', 'json.loads()'],
              correctOptionIndex: 1,
              explanation: '`json.dumps()` (dump string) serializes an object to a string. `json.dump()` writes directly to a file stream.'
            }
          ]
        }
      },
      {
        id: 'les-8-2',
        moduleId: 'mod-8',
        order: 2,
        title: 'Exception Handling: try, except, else, finally & Custom Errors',
        slug: 'try-except-else-finally-custom-errors',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-8-1'],
        learningObjectives: [
          'Catch specific exceptions rather than bare `except:`',
          'Use the `else` clause for code that should run only if no exceptions occurred',
          'Use `finally` for mandatory cleanup actions (closing connections, releasing locks)',
          'Create custom exception classes inheriting from Exception'
        ],
        concepts: ['try', 'except', 'else', 'finally', 'raise', 'Custom Exceptions'],
        summary: 'Structured error handling prevents software crashes. The try block attempts risky code; except catches errors; else runs on success; and finally runs unconditionally.',
        starterCode: `# Complete try-except-else-finally architecture with custom exceptions
class InsufficientFundsError(Exception):
    """Raised when a bank account withdrawal exceeds balance."""
    def __init__(self, balance, amount):
        super().__init__(f"Withdrawal of \${amount} exceeds current balance of \${balance}.")
        self.balance = balance
        self.amount = amount

def process_withdrawal(balance, amount):
    print(f"\\nInitiating withdrawal: \${amount} against balance \${balance}...")
    try:
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")
        if amount > balance:
            raise InsufficientFundsError(balance, amount)
        new_balance = balance - amount
    except ValueError as val_err:
        print(f"  [Input Error Caught]: {val_err}")
    except InsufficientFundsError as funds_err:
        print(f"  [Transaction Rejected]: {funds_err}")
    else:
        print(f"  [Success]: New balance is \${new_balance}")
    finally:
        print("  [Audit]: Transaction log entry closed.")

process_withdrawal(500, 150) # Successful
process_withdrawal(500, 750) # Triggers custom InsufficientFundsError
`,
        sections: [
          {
            id: 'sec-8-2-1',
            title: 'The Complete Exception Lifecycle',
            content: `### Exception Flow Diagram:
\`\`\`text
try:
    # Code that might fail
except SpecificError as e:
    # Runs ONLY if SpecificError occurred
else:
    # Runs ONLY if NO exception was raised in try
finally:
    # ALWAYS runs, regardless of success, failure, or return!
\`\`\`

### Why Bare \`except:\` is Dangerous:
Writing \`except:\` catches **everything**, including \`KeyboardInterrupt\` (Ctrl+C) and \`SystemExit\`! This prevents users from terminating stuck scripts. Always catch specific exceptions (e.g. \`except (ValueError, KeyError) as e:\`).`,
            codeExamples: [
              {
                title: 'Safe Numeric Conversion with try-except',
                description: 'Handling malformed user inputs without crashing.',
                code: `def parse_user_age(raw_input: str) -> int:
    try:
        age = int(raw_input)
        if age < 0 or age > 120:
            raise ValueError("Age must be between 0 and 120.")
    except ValueError as err:
        print(f"Validation failed for '{raw_input}': {err}")
        return -1
    else:
        return age

print("Valid age parsed:  ", parse_user_age("24"))
print("Invalid text parsed:", parse_user_age("twenty"))
print("Out of range parsed:", parse_user_age("150"))
`,
                expectedOutput: `Valid age parsed:   24
Validation failed for 'twenty': invalid literal for int() with base 10: 'twenty'
Invalid text parsed: -1
Validation failed for '150': Age must be between 0 and 120.
Out of range parsed: -1`,
                lineByLine: [
                  { line: 'except ValueError as err:', explanation: 'Catches both standard conversion errors from int() and custom ValueError exceptions raised manually.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Silent error suppression with bare except and pass',
                why: 'Writing `except: pass` hides critical bugs, typos, and syntax errors, making debugging nearly impossible.',
                fix: 'Log the error or catch only the exact expected exception.',
                badCode: 'try:\n    do_important_thing()\nexcept:\n    pass # Total system blindness!',
                goodCode: 'try:\n    do_important_thing()\nexcept ExpectedNetworkError as err:\n    logger.warning("Retry needed: %s", err)'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-8-2',
          title: 'Lesson 8.2 Knowledge Check',
          moduleId: 'mod-8',
          lessonId: 'les-8-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-8-2-1',
              type: 'mcq',
              question: 'When does the `finally` block execute in Python?',
              options: [
                'Only when an exception is caught',
                'Only when no exceptions occur',
                'Unconditionally under all circumstances, even if return or an unhandled exception occurred',
                'Only inside class methods'
              ],
              correctOptionIndex: 2,
              explanation: 'The `finally` block is guaranteed to execute before the try-except-finally statement completes.'
            },
            {
              id: 'q-8-2-2',
              type: 'mcq',
              question: 'What base class should custom exceptions inherit from in Python?',
              options: ['BaseException', 'Exception', 'object', 'ErrorInterface'],
              correctOptionIndex: 1,
              explanation: 'Custom exceptions should subclass `Exception`. `BaseException` is reserved for system-exiting exceptions like `KeyboardInterrupt`.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-8',
      title: 'Module 8 Assessment: File Handling & Exceptions',
      moduleId: 'mod-8',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-8-1',
          type: 'mcq',
          question: 'Which file mode opens a file for writing without truncating/deleting its existing contents?',
          options: ['"w"', '"r"', '"a"', '"x"'],
          correctOptionIndex: 2,
          explanation: '"a" opens the file in append mode, placing the file pointer at the end of the file.'
        },
        {
          id: 'cq-8-2',
          type: 'predict-output',
          question: 'What is printed by this try-except-else-finally snippet?',
          codeSnippet: 'try:\n    x = 10 / 2\nexcept ZeroDivisionError:\n    print("Error")\nelse:\n    print("Success")\nfinally:\n    print("Cleanup")',
          options: ['Success\nCleanup', 'Error\nCleanup', 'Cleanup', 'Success'],
          correctOptionIndex: 0,
          explanation: '10/2 succeeds without error, so `else` prints "Success", followed unconditionally by `finally` printing "Cleanup".'
        },
        {
          id: 'cq-8-3',
          type: 'mcq',
          question: 'What keyword is used to trigger an exception intentionally in Python?',
          options: ['throw', 'raise', 'emit', 'fail'],
          correctOptionIndex: 1,
          explanation: 'In Python, `raise` is the keyword used to throw exceptions.'
        },
        {
          id: 'cq-8-4',
          type: 'predict-output',
          question: 'What does `json.loads(\'{"active": true}\')` return?',
          options: ["{'active': True}", '{"active": "true"}', 'True', 'SyntaxError'],
          correctOptionIndex: 0,
          explanation: '`json.loads()` converts the JSON boolean `true` into the Python boolean `True` in a dictionary.'
        },
        {
          id: 'cq-8-5',
          type: 'find-bug',
          question: 'Why is `except Exception:` preferred over bare `except:`?',
          options: [
            'Bare except does not catch ZeroDivisionError',
            'Bare except also catches KeyboardInterrupt (Ctrl+C) and SystemExit, making it impossible to stop a running script',
            'Bare except is slower',
            'Python 3 no longer allows bare except'
          ],
          correctOptionIndex: 1,
          explanation: 'Bare `except:` intercepts `BaseException`, stopping intentional user termination signals.'
        }
      ]
    }
  },
  {
    id: 'mod-9',
    order: 9,
    number: 9,
    title: 'Object-Oriented Programming (OOP)',
    slug: 'object-oriented-programming',
    tagline: 'Classes, encapsulation, inheritance, polymorphism, properties, and special dunder methods',
    description: 'Master enterprise-grade object-oriented design in Python. Understand classes as blueprints, the role of self and __init__, class and static methods, data encapsulation, multi-level inheritance with super(), abstract base classes, properties, and special dunder methods (__str__, __repr__, __eq__, __len__).',
    difficulty: 'intermediate',
    iconName: 'Cpu',
    prerequisites: ['mod-8'],
    learningObjectives: [
      'Design classes and instantiate stateful objects',
      'Understand why self represents the current instance',
      'Encapsulate attributes using protected (_var) and private (__var) conventions',
      'Implement inheritance and leverage super() for method resolution (MRO)',
      'Create clean getter/setter APIs with @property',
      'Implement special dunder methods (__repr__, __str__, __len__, __eq__)'
    ],
    estimatedHours: 7,
    lessons: [
      {
        id: 'les-9-1',
        moduleId: 'mod-9',
        order: 1,
        title: 'Classes, Objects, __init__ & self',
        slug: 'classes-objects-and-self',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-8-2'],
        learningObjectives: [
          'Understand class blueprints vs concrete instances',
          'Explain the __init__ constructor and why `self` is explicitly passed',
          'Distinguish between instance attributes and class-level attributes'
        ],
        concepts: ['Class', 'Instance', '__init__', 'self', 'Class Attributes'],
        summary: 'A class is a blueprint that defines data fields and methods. When an object is instantiated, Python passes the new instance as the first argument (self) to __init__.',
        starterCode: `# Building a clean Student class with instance and class attributes
class Student:
    # Class-level attribute (shared by all students)
    academy_name = "PyPath Academy"
    total_students = 0

    def __init__(self, name: str, student_id: int):
        # Instance-level attributes (unique to each object)
        self.name = name
        self.student_id = student_id
        self.courses = []
        Student.total_students += 1

    def enroll(self, course_name: str):
        self.courses.append(course_name)
        print(f"{self.name} enrolled in {course_name}")

# Create instances
s1 = Student("Maya Patel", 101)
s2 = Student("Liam Vance", 102)

s1.enroll("Python Mastery")
s2.enroll("Algorithms & Data Structures")

print(f"Total students across {Student.academy_name}: {Student.total_students}")
`,
        sections: [
          {
            id: 'sec-9-1-1',
            title: 'Demystifying `self` in Python',
            content: `Unlike languages like C++ or Java where \`this\` is a hidden keyword, in Python **\`self\` is an explicit parameter**.

When you invoke:
\`\`\`python
student.enroll("Python")
\`\`\`
Python translates this internally to:
\`\`\`python
Student.enroll(student, "Python")
\`\`\`
\`self\` is simply a reference to the specific object instance calling the method!`,
            codeExamples: [
              {
                title: 'Instance vs Class Attributes',
                description: 'Understanding how class-level state is shared across all instances.',
                code: `class BankAccount:
    interest_rate = 0.04 # Class attribute

    def __init__(self, owner: str, balance: float):
        self.owner = owner     # Instance attribute
        self.balance = balance # Instance attribute

    def apply_interest(self):
        earned = self.balance * BankAccount.interest_rate
        self.balance += earned
        return earned

acc = BankAccount("Elena", 1000.0)
earned = acc.apply_interest()
print(f"{acc.owner} balance after interest: \${acc.balance:.2f} (Earned \${earned:.2f})")
`,
                expectedOutput: `Elena balance after interest: $1040.00 (Earned $40.00)`,
                lineByLine: [
                  { line: 'interest_rate = 0.04', explanation: 'Class attribute defined outside any method, shared by all accounts.' },
                  { line: 'self.balance = balance', explanation: 'Instance attribute stored on the individual object dictionary.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Omitting self as the first parameter in method signatures',
                why: 'When the method is called on an instance, Python passes the instance as the 1st argument. Without self, Python raises TypeError: method takes 0 positional arguments but 1 was given.',
                fix: 'Always declare def method(self, ...): for instance methods.',
                badCode: 'class Counter:\n    def increment(): # Missing self!\n        pass',
                goodCode: 'class Counter:\n    def increment(self):\n        pass'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-9-1',
          title: 'Lesson 9.1 Knowledge Check',
          moduleId: 'mod-9',
          lessonId: 'les-9-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-9-1-1',
              type: 'mcq',
              question: 'What does `self` represent in a Python instance method?',
              options: [
                'The parent class',
                'The Python interpreter itself',
                'The specific instance of the class that called the method',
                'A global singleton'
              ],
              correctOptionIndex: 2,
              explanation: '`self` represents the instance on which the method was invoked.'
            },
            {
              id: 'q-9-1-2',
              type: 'predict-output',
              question: 'What is the role of `__init__` in a Python class?',
              options: [
                'It deletes the class from memory.',
                'It serves as the constructor/initializer that sets up initial instance state.',
                'It imports external packages.',
                'It compiles the class to C code.'
              ],
              correctOptionIndex: 1,
              explanation: '`__init__` is Python\'s constructor method, called immediately after a new instance has been created.'
            }
          ]
        }
      },
      {
        id: 'les-9-2',
        moduleId: 'mod-9',
        order: 2,
        title: 'Inheritance, super() & Polymorphism',
        slug: 'inheritance-super-and-polymorphism',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-9-1'],
        learningObjectives: [
          'Create child classes inheriting from parent classes',
          'Use super() to extend parent constructors and methods',
          'Leverage polymorphism for uniform interfaces across related classes'
        ],
        concepts: ['Inheritance', 'super()', 'Method Overriding', 'Polymorphism', 'MRO'],
        summary: 'Inheritance allows a subclass to inherit attributes and methods from a superclass. `super()` calls the parent method without explicitly hardcoding the parent class name.',
        starterCode: `# Polymorphism and inheritance in action
class Notification:
    def __init__(self, recipient: str):
        self.recipient = recipient

    def send(self, message: str):
        raise NotImplementedError("Subclasses must implement send()")

class EmailNotification(Notification):
    def send(self, message: str):
        print(f"📧 Sending EMAIL to {self.recipient}: '{message}'")

class SMSNotification(Notification):
    def send(self, message: str):
        print(f"📱 Sending SMS to {self.recipient}: '{message}'")

# Polymorphic dispatcher
notifications = [
    EmailNotification("alex@example.com"),
    SMSNotification("+1-555-0199")
]

for notif in notifications:
    notif.send("Your PyPath lesson is ready!")
`,
        sections: [
          {
            id: 'sec-9-2-1',
            title: 'Using `super().__init__()` Correctly',
            content: `When a child class overrides \`__init__\`, the parent\'s \`__init__\` is **not called automatically**!

You must invoke \`super().__init__(...)\` so the parent class can initialize its own attributes properly:
\`\`\`python
class Employee:
    def __init__(self, name: str, salary: float):
        self.name = name
        self.salary = salary

class Manager(Employee):
    def __init__(self, name: str, salary: float, department: str):
        super().__init__(name, salary) # Initialize parent attributes
        self.department = department   # Specific to Manager
\`\`\``,
            codeExamples: [
              {
                title: 'Extending Parent Methods with super()',
                description: 'Augmenting behavior while retaining superclass logic.',
                code: `class Account:
    def __init__(self, balance: float):
        self.balance = balance

    def withdraw(self, amount: float):
        if amount > self.balance:
            raise ValueError("Insufficient balance.")
        self.balance -= amount
        return amount

class FeeAccount(Account):
    def withdraw(self, amount: float):
        fee = 2.50
        print(f"Applying withdrawal fee of \${fee:.2f}")
        # Call base withdraw with amount + fee
        return super().withdraw(amount + fee)

acc = FeeAccount(100.0)
acc.withdraw(20.0)
print(f"Remaining balance: \${acc.balance:.2f}")
`,
                expectedOutput: `Applying withdrawal fee of $2.50
Remaining balance: $77.50`,
                lineByLine: [
                  { line: 'super().withdraw(amount + fee)', explanation: 'Delegates the balance deduction and validation to Account.withdraw.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Forgetting to call super().__init__() in a subclass',
                why: 'Attributes expected from the superclass will not be created, causing AttributeError when accessed on the child instance.',
                fix: 'Always call super().__init__() in derived classes that override __init__.',
                badCode: 'class Child(Parent):\n    def __init__(self, extra):\n        self.extra = extra # Parent attributes missing!',
                goodCode: 'class Child(Parent):\n    def __init__(self, name, extra):\n        super().__init__(name)\n        self.extra = extra'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-9-2',
          title: 'Lesson 9.2 Knowledge Check',
          moduleId: 'mod-9',
          lessonId: 'les-9-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-9-2-1',
              type: 'mcq',
              question: 'What is the primary role of `super()` in Python?',
              options: [
                'It upgrades the program to root administrator.',
                'It returns a proxy object that delegates method calls to the parent or sibling class in the MRO.',
                'It prevents a class from being subclassed.',
                'It calculates square roots.'
              ],
              correctOptionIndex: 1,
              explanation: '`super()` delegates method lookups to the next class in the Method Resolution Order (MRO).'
            },
            {
              id: 'q-9-2-2',
              type: 'mcq',
              question: 'What does polymorphism allow in Python?',
              options: [
                'Objects of different classes to respond to the same method interface.',
                'Code to execute without installing Python.',
                'A variable to have multiple types simultaneously in C.',
                'Automatic translation into HTML.'
              ],
              correctOptionIndex: 0,
              explanation: 'Polymorphism allows different objects to be treated through a common interface.'
            }
          ]
        }
      },
      {
        id: 'les-9-3',
        moduleId: 'mod-9',
        order: 3,
        title: '@property Decorators & Special Dunder Methods',
        slug: 'properties-and-dunder-methods',
        difficulty: 'intermediate',
        durationMinutes: 30,
        prerequisites: ['les-9-2'],
        learningObjectives: [
          'Create Pythonic getters and setters with @property and @<name>.setter',
          'Implement __str__ (human-readable) and __repr__ (unambiguous developer representation)',
          'Implement comparison (__eq__) and sequence protocols (__len__, __getitem__)'
        ],
        concepts: ['@property', 'Getter & Setter', '__repr__', '__str__', '__len__', '__eq__'],
        summary: 'Special dunder (double-underscore) methods allow custom classes to integrate with Python language features like str(), len(), ==, and printing.',
        starterCode: `# Building a Vector class with Pythonic dunder methods
class Vector2D:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    # Developer representation for debugging
    def __repr__(self) -> str:
        return f"Vector2D(x={self.x}, y={self.y})"

    # User-facing string representation
    def __str__(self) -> str:
        return f"({self.x}, {self.y})"

    # Overload addition operator (+)
    def __add__(self, other: "Vector2D") -> "Vector2D":
        return Vector2D(self.x + other.x, self.y + other.y)

    # Overload equality operator (==)
    def __eq__(self, other: object) -> bool:
        if isinstance(other, Vector2D):
            return self.x == other.x and self.y == other.y
        return False

v1 = Vector2D(3, 4)
v2 = Vector2D(1, 2)
v3 = v1 + v2

print("v1:", v1)
print("v2:", v2)
print("v1 + v2 =", v3)
print("v3 == Vector2D(4, 6):", v3 == Vector2D(4, 6))
`,
        sections: [
          {
            id: 'sec-9-3-1',
            title: '__str__ vs __repr__',
            content: `- **\`__repr__\`**: Should be unambiguous and, if possible, look like valid Python code to recreate the object: \`ClassName(arg1, arg2)\`. Crucial for debugging and logging!
- **\`__str__\`**: Clean, user-friendly presentation. If \`__str__\` is not defined, Python falls back to \`__repr__\`.

### The \`@property\` Decorator:
In Java or C++, developers write \`getTemperature()\` and \`setTemperature()\`.
In Python, we use \`@property\` to expose attributes cleanly while still enforcing validation:
\`\`\`python
class Thermostat:
    def __init__(self, celsius: float):
        self._celsius = celsius

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero!")
        self._celsius = value
\`\`\``,
            codeExamples: [
              {
                title: 'Data Validation via @property',
                description: 'Validating temperature bounds cleanly using property setters.',
                code: `class Temperature:
    def __init__(self, celsius: float):
        self.celsius = celsius # Calls setter!

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, val):
        if val < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = val

    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32

t = Temperature(25)
print(f"Celsius: {t.celsius}°C == {t.fahrenheit}°F")
t.celsius = 35
print(f"Updated: {t.celsius}°C == {t.fahrenheit}°F")
`,
                expectedOutput: `Celsius: 25°C == 77.0°F
Updated: 35°C == 95.0°F`,
                lineByLine: [
                  { line: 'self.celsius = celsius', explanation: 'Inside __init__, assigning to self.celsius runs the @celsius.setter validation automatically.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Naming the private property backing field the exact same name as the property',
                why: 'Writing `self.celsius = value` inside `def celsius(self, value):` causes infinite recursive loops until RecursionError!',
                fix: 'Store the actual value in an underscore-prefixed attribute like `self._celsius`.',
                badCode: '@celsius.setter\ndef celsius(self, val):\n    self.celsius = val # RecursionError!',
                goodCode: '@celsius.setter\ndef celsius(self, val):\n    self._celsius = val'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-9-3',
          title: 'Lesson 9.3 Knowledge Check',
          moduleId: 'mod-9',
          lessonId: 'les-9-3',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-9-3-1',
              type: 'mcq',
              question: 'Which special dunder method is called when `len(my_object)` is executed?',
              options: ['__size__', '__count__', '__len__', '__length__'],
              correctOptionIndex: 2,
              explanation: '`__len__` is the dunder method required to support `len()`.'
            },
            {
              id: 'q-9-3-2',
              type: 'predict-output',
              question: 'What is the goal of `__repr__` compared to `__str__`?',
              options: [
                '__repr__ is for informal user display, __str__ is for machine learning.',
                '__repr__ provides an unambiguous developer representation, while __str__ provides human-friendly text.',
                'They are completely identical with no differences.',
                '__repr__ is only used for integers.'
              ],
              correctOptionIndex: 1,
              explanation: '`__repr__` is intended for developers and debugging (ideally copy-pasteable code), whereas `__str__` is for end-user display.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-9',
      title: 'Module 9 Assessment: Object-Oriented Programming',
      moduleId: 'mod-9',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-9-1',
          type: 'mcq',
          question: 'What does a leading underscore in an attribute name like `_balance` signal in Python?',
          options: [
            'The attribute is private and physically blocked from being read by the compiler.',
            'A convention indicating the attribute is protected/internal and should not be accessed outside the class.',
            'The attribute is stored on the GPU.',
            'The attribute will be deleted after 10 seconds.'
          ],
          correctOptionIndex: 1,
          explanation: 'In Python, a single leading underscore is a PEP 8 convention indicating internal/protected implementation detail.'
        },
        {
          id: 'cq-9-2',
          type: 'predict-output',
          question: 'What does this code print?',
          codeSnippet: 'class A:\n    def speak(self):\n        return "A"\nclass B(A):\n    def speak(self):\n        return super().speak() + "B"\nprint(B().speak())',
          options: ['B', 'AB', 'A', 'TypeError'],
          correctOptionIndex: 1,
          explanation: '`super().speak()` returns "A", and `"A" + "B"` returns "AB".'
        },
        {
          id: 'cq-9-3',
          type: 'mcq',
          question: 'Which method decorator defines a method that takes the class `cls` as its first argument instead of an instance `self`?',
          options: ['@staticmethod', '@classmethod', '@property', '@abstractmethod'],
          correctOptionIndex: 1,
          explanation: '`@classmethod` passes the class object (`cls`) as the first argument, commonly used for factory constructors.'
        },
        {
          id: 'cq-9-4',
          type: 'predict-output',
          question: 'What does `hasattr("Python", "upper")` evaluate to?',
          options: ['True', 'False', 'None', 'AttributeError'],
          correctOptionIndex: 0,
          explanation: '`hasattr(obj, name)` checks whether an object possesses the given attribute or method. Strings have an `.upper()` method, so it evaluates to `True`.'
        },
        {
          id: 'cq-9-5',
          type: 'mcq',
          question: 'Which dunder method must be implemented to support the equality operator `a == b`?',
          options: ['__equal__', '__eq__', '__compare__', '__is__'],
          correctOptionIndex: 1,
          explanation: '`__eq__` implements the `==` comparison operator.'
        }
      ]
    }
  }
];
