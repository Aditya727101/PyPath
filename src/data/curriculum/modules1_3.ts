import { Module } from '../../types/curriculum';

export const modules1_3: Module[] = [
  {
    id: 'mod-1',
    order: 1,
    number: 1,
    title: 'Introduction to Python',
    slug: 'introduction-to-python',
    tagline: 'Your gateway to Python: history, architecture, and your first programs',
    description: 'Understand what makes Python the world\'s most popular language. Learn how interpreters work, set up your development mindset, and write your first error-free programs.',
    difficulty: 'beginner',
    iconName: 'Terminal',
    prerequisites: ['Basic computer literacy', 'Curiosity and enthusiasm'],
    learningObjectives: [
      'Understand the philosophy, syntax elegance, and versatility of Python 3',
      'Explain the difference between compiled vs interpreted bytecode execution',
      'Master the print() function, string literals, and comment conventions',
      'Diagnose and correct common first-program syntax errors'
    ],
    estimatedHours: 4,
    lessons: [
      {
        id: 'les-1-1',
        moduleId: 'mod-1',
        order: 1,
        title: 'What Python Is & Why It Dominates Software',
        slug: 'what-is-python',
        difficulty: 'beginner',
        durationMinutes: 20,
        prerequisites: [],
        learningObjectives: [
          'Know Python\'s origin by Guido van Rossum in 1991',
          'Understand The Zen of Python (PEP 20) readability philosophy',
          'Explore domains where Python leads: AI, Data Science, Web, Automation'
        ],
        concepts: ['Interpreted Language', 'Dynamically Typed', 'High Level', 'Batteries Included'],
        summary: 'Python is a high-level, interpreted, general-purpose programming language designed with an uncompromising focus on code readability.',
        starterCode: `# Discover Python's foundational design philosophy
import this
`,
        sections: [
          {
            id: 'sec-1-1-1',
            title: 'The Python Philosophy & Real-World Reach',
            content: `Python was conceived in 1989 by Dutch programmer Guido van Rossum and released in 1991. Van Rossum named it after the British comedy troupe **Monty Python**, not the snake!

Its design philosophy is immortalized in **The Zen of Python (PEP 20)**:
* *Beautiful is better than ugly.*
* *Explicit is better than implicit.*
* *Simple is better than complex.*
* *Readability counts.*

Today, Python powers:
1. **Artificial Intelligence & Machine Learning:** PyTorch, TensorFlow, Hugging Face.
2. **Backend Web APIs:** FastAPI, Django, Flask (Instagram, Spotify, Netflix).
3. **Scientific Computing:** NASA, CERN, NumPy, SciPy.
4. **DevOps & Cybersecurity:** Automation scripts, penetration testing, Cloud SDKs.`,
            codeExamples: [
              {
                title: 'Displaying System Information in Python',
                description: 'Using the standard library to inspect the Python runtime environment.',
                code: `import sys
import platform

print("Welcome to PyPath Academy!")
print(f"Python Version: {platform.python_version()}")
print(f"Architecture: {platform.architecture()[0]}")
print(f"Interpreter: {platform.python_implementation()}")
`,
                expectedOutput: `Welcome to PyPath Academy!
Python Version: 3.12.0
Architecture: 64bit
Interpreter: CPython`,
                lineByLine: [
                  { line: 'import sys, platform', explanation: 'Imports built-in modules for operating system and interpreter data.' },
                  { line: 'print(...)', explanation: 'Prints formatted text to standard output.' },
                  { line: 'f"..."', explanation: 'An f-string (formatted string literal) introduced in Python 3.6 for readable interpolation.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Confusing Python 2 with Python 3',
                why: 'Python 2 was officially sunset on January 1, 2020. Python 3 is not backwards-compatible.',
                fix: 'Always use Python 3.x syntax (e.g., print() is a function with parentheses, not a statement).',
                badCode: 'print "Hello World"',
                goodCode: 'print("Hello World")'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-1-1',
          title: 'Lesson 1.1 Knowledge Check',
          moduleId: 'mod-1',
          lessonId: 'les-1-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-1-1-1',
              type: 'mcq',
              question: 'Who created the Python programming language?',
              options: ['Dennis Ritchie', 'Guido van Rossum', 'Bjarne Stroustrup', 'James Gosling'],
              correctOptionIndex: 1,
              explanation: 'Guido van Rossum created Python in the late 1980s and released the first version in 1991.'
            },
            {
              id: 'q-1-1-2',
              type: 'predict-output',
              question: 'What is the output of executing `import this` in standard Python?',
              codeSnippet: 'import this',
              options: [
                'SyntaxError: invalid syntax',
                'The Zen of Python poem by Tim Peters',
                'None',
                'A Monty Python video sketch'
              ],
              correctOptionIndex: 1,
              explanation: '`import this` is an Easter egg in Python that prints "The Zen of Python", 19 design aphorisms by Tim Peters.'
            },
            {
              id: 'q-1-1-3',
              type: 'mcq',
              question: 'Why is Python considered an "interpreted" language?',
              options: [
                'It cannot run on microprocessors.',
                'Source code is converted to bytecode and executed line-by-line or block-by-block by a virtual machine (CPython) rather than pre-compiled to native machine code.',
                'It only works inside a web browser.',
                'You do not need to save the file to run it.'
              ],
              correctOptionIndex: 1,
              explanation: 'Python source code (.py) is compiled into bytecode (.pyc) which is then executed by the CPython interpreter/virtual machine.'
            }
          ]
        }
      },
      {
        id: 'les-1-2',
        moduleId: 'mod-1',
        order: 2,
        title: 'Python Execution: CPython, Bytecode & The REPL',
        slug: 'interpreters-and-execution',
        difficulty: 'beginner',
        durationMinutes: 25,
        prerequisites: ['les-1-1'],
        learningObjectives: [
          'Understand how the CPython interpreter parses source code into AST and bytecode',
          'Explore the interactive REPL (Read-Eval-Print Loop)',
          'Learn how `.pyc` caching works in `__pycache__`'
        ],
        concepts: ['Bytecode', 'CPython', 'Virtual Machine', 'REPL', 'AST'],
        summary: 'When you execute a Python script, it is first compiled into intermediate bytecode instructions, then executed sequentially by the Python Virtual Machine (PVM).',
        starterCode: `# Let's inspect Python bytecode disassembly using the standard 'dis' module!
import dis

def calculate_net_salary(gross, tax_rate):
    return gross * (1 - tax_rate)

# Disassemble the function into Python bytecode instructions
dis.dis(calculate_net_salary)
`,
        sections: [
          {
            id: 'sec-1-2-1',
            title: 'How Python Actually Runs Your Code',
            content: `Many people describe Python as "interpreted," but internally it operates in two distinct phases:

1. **Compilation to Bytecode:**
   The CPython compiler parses your source code, checks syntax, generates an Abstract Syntax Tree (AST), and compiles it into low-level instructions called **bytecode** (stack-based opcodes).
2. **Execution by the PVM:**
   The **Python Virtual Machine** evaluates the bytecode loop instruction-by-instruction.

When you run a file \`script.py\`, Python caches the compiled bytecode in \`__pycache__/script.cpython-312.pyc\`. Next time you run without changes, Python skips the compilation step!`,
            codeExamples: [
              {
                title: 'Disassembling a Calculation Function',
                description: 'See the underlying stack operations Python performs.',
                code: `import dis

def add_bonus(salary, bonus):
    total = salary + bonus
    return total

print("Disassembled Bytecode:")
dis.dis(add_bonus)
`,
                expectedOutput: `Disassembled Bytecode:
  LOAD_FAST                0 (salary)
  LOAD_FAST                1 (bonus)
  BINARY_OP                0 (+)
  STORE_FAST               2 (total)
  LOAD_FAST                2 (total)
  RETURN_VALUE`,
                lineByLine: [
                  { line: 'LOAD_FAST 0', explanation: 'Pushes the local parameter salary onto the virtual machine evaluation stack.' },
                  { line: 'BINARY_OP 0 (+)', explanation: 'Pops two items, adds them, and pushes the result back onto the stack.' },
                  { line: 'STORE_FAST 2', explanation: 'Stores the top of stack into the local variable `total`.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Assuming Python compiles to standalone machine code like C/C++',
                why: 'Python bytecode requires the Python runtime / PVM to be installed on the host system to run.',
                fix: 'Package applications using tools like PyInstaller, Docker, or distribute as wheels.',
                badCode: '# expecting gcc or clang to compile script.py into a raw x86 ELF binary',
                goodCode: '# python3 script.py (runs via CPython PVM)'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-1-2',
          title: 'Lesson 1.2 Knowledge Check',
          moduleId: 'mod-1',
          lessonId: 'les-1-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-1-2-1',
              type: 'mcq',
              question: 'What is the default, reference implementation of Python written in C?',
              options: ['Jython', 'PyPy', 'CPython', 'IronPython'],
              correctOptionIndex: 2,
              explanation: 'CPython is the reference implementation of Python written in C, maintained by the Python Software Foundation.'
            },
            {
              id: 'q-1-2-2',
              type: 'mcq',
              question: 'Where does Python cache compiled bytecode files?',
              options: ['In the /bin/ directory', 'Inside the __pycache__ directory with a .pyc extension', 'In the Windows Registry', 'In browser cookies'],
              correctOptionIndex: 1,
              explanation: 'Compiled bytecode is saved in `__pycache__` with filenames such as `module.cpython-312.pyc`.'
            }
          ]
        }
      },
      {
        id: 'les-1-3',
        moduleId: 'mod-1',
        order: 3,
        title: 'First Program, print() Mechanics & Comments',
        slug: 'first-program-print-and-comments',
        difficulty: 'beginner',
        durationMinutes: 30,
        prerequisites: ['les-1-1'],
        learningObjectives: [
          'Master print() arguments: sep, end, and file',
          'Use single-line (#) and multi-line comments effectively',
          'Understand escape sequences (\\n, \\t, \\\\, \\")'
        ],
        concepts: ['print()', 'sep keyword', 'end keyword', 'Comments', 'Escape Characters'],
        summary: 'The print() function outputs data to the console. Mastering its parameters (sep, end) and clear code documentation with comments builds your foundational programming hygiene.',
        starterCode: `# Experiment with print() parameters: sep and end
print("Apple", "Banana", "Cherry", sep=" -> ")
print("Loading progress", end="... ")
print("Complete!")
`,
        sections: [
          {
            id: 'sec-1-3-1',
            title: 'Mastering the print() Built-In Function',
            content: `The \`print()\` function signature is:
\`\`\`python
print(*objects, sep=' ', end='\\n', file=None, flush=False)
\`\`\`

Key parameters:
- \`*objects\`: Any number of values separated by commas.
- \`sep\`: String inserted between values. Defaults to a single space (\`' '\`).
- \`end\`: String appended after the last value. Defaults to newline (\`'\\n'\`).
- \`flush\`: Whether to forcibly flush the stream buffer immediately.`,
            codeExamples: [
              {
                title: 'Customizing print() Output',
                description: 'Showcasing custom separators, end terminators, and escape codes.',
                code: `# 1. Custom Separator
print("2026", "09", "28", sep="-")

# 2. Preventing Newline with custom end
print("Calculating trajectory", end="")
print("... 100% [DONE]")

# 3. Escape sequences
print("Header 1\\tHeader 2\\nItem A\\tItem B")
`,
                expectedOutput: `2026-09-28
Calculating trajectory... 100% [DONE]
Header 1	Header 2
Item A	Item B`,
                lineByLine: [
                  { line: 'sep="-"', explanation: 'Replaces the default space between arguments with a hyphen.' },
                  { line: 'end=""', explanation: 'Prevents moving to the next line so the following print continues on the same line.' },
                  { line: '\\t and \\n', explanation: 'Tab character for alignment and newline character for line breaks.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Passing mismatched quotes or forgetting closing parenthesis',
                why: 'Python string literals must start and end with the same matching quote symbol (either single \' or double ").',
                fix: 'Always pair quotes and parentheses properly.',
                badCode: 'print("Hello world\')',
                goodCode: 'print("Hello world")'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-1-3',
          title: 'Lesson 1.3 Knowledge Check',
          moduleId: 'mod-1',
          lessonId: 'les-1-3',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-1-3-1',
              type: 'predict-output',
              question: 'What is printed by the following code?',
              codeSnippet: 'print("A", "B", "C", sep="*", end="#")\nprint("D")',
              options: [
                'A B C#\nD',
                'A*B*C#D',
                'A*B*C\\n#D',
                'SyntaxError'
              ],
              correctOptionIndex: 1,
              explanation: '`sep="*"` separates A, B, C into `A*B*C`. `end="#"` finishes with `#` without a newline, so `print("D")` outputs `D` immediately adjacent, producing `A*B*C#D`.'
            },
            {
              id: 'q-1-3-2',
              type: 'find-bug',
              question: 'Which line contains a syntax error?',
              codeSnippet: '1: # Calculate area\n2: length = 10\n3: width = 5\n4: print("Area is: " + length * width)',
              options: [
                'Line 1',
                'Line 2',
                'Line 3',
                'Line 4 (TypeError: can only concatenate str to str, not int)'
              ],
              correctOptionIndex: 3,
              explanation: 'In Python, you cannot concatenate strings and integers with `+`. You should use commas `print("Area is:", length * width)` or an f-string.'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-1',
      title: 'Module 1 Assessment: Python Fundamentals',
      moduleId: 'mod-1',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-1-1',
          type: 'mcq',
          question: 'Which of the following is NOT a design principle in The Zen of Python?',
          options: [
            'Readability counts.',
            'Complex is better than complicated.',
            'Memory optimization takes precedence over developer readability.',
            'Explicit is better than implicit.'
          ],
          correctOptionIndex: 2,
          explanation: 'The Zen of Python emphasizes clarity and simplicity over premature micro-optimizations.'
        },
        {
          id: 'cq-1-2',
          type: 'predict-output',
          question: 'What is the output of this code snippet?',
          codeSnippet: 'print("Python", "3", sep="", end="!\\n")',
          options: ['Python 3!', 'Python3!', 'Python3 !', 'Python\\n3!'],
          correctOptionIndex: 1,
          explanation: '`sep=""` removes any spacing between "Python" and "3", and `end="!\\n"` appends an exclamation mark and newline.'
        },
        {
          id: 'cq-1-3',
          type: 'mcq',
          question: 'How do you create a single-line comment in Python?',
          options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '<!-- This is a comment -->'],
          correctOptionIndex: 2,
          explanation: 'Python uses the hash `#` symbol for single-line comments.'
        },
        {
          id: 'cq-1-4',
          type: 'find-bug',
          question: 'Why does `print("Hello World)` fail in Python?',
          codeSnippet: 'print("Hello World)',
          options: [
            'print must be capitalized',
            'EOL (End of Line) scanning string literal error: missing closing quotation mark',
            'Python requires a semicolon at the end of the line',
            'Quotes are not allowed inside print'
          ],
          correctOptionIndex: 1,
          explanation: 'The string literal has an opening double quote `"` but lacks a closing quote, resulting in `SyntaxError: unterminated string literal`.'
        },
        {
          id: 'cq-1-5',
          type: 'mcq',
          question: 'What is the role of the Python Virtual Machine (PVM)?',
          options: [
            'It translates C++ to Python.',
            'It reads and executes compiled Python bytecode instruction by instruction.',
            'It is a hypervisor like VirtualBox for installing Linux.',
            'It formats Python code according to PEP 8.'
          ],
          correctOptionIndex: 1,
          explanation: 'The PVM is the runtime execution loop of CPython that processes bytecode instructions.'
        }
      ]
    }
  },
  {
    id: 'mod-2',
    order: 2,
    number: 2,
    title: 'Variables and Data Types',
    slug: 'variables-and-data-types',
    tagline: 'Memory, identity, dynamic typing, type casting, and expressions',
    description: 'Learn how Python stores information in memory. Master integers, floats, strings, booleans, arithmetic precedence, dynamic typing, and safe user input.',
    difficulty: 'beginner',
    iconName: 'Boxes',
    prerequisites: ['mod-1'],
    learningObjectives: [
      'Understand Python\'s object reference model (names pointing to objects in heap memory)',
      'Differentiate between int, float, str, and bool data types',
      'Master explicit type casting with int(), float(), str(), bool()',
      'Acquire interactive user input with input() and handle numeric conversion',
      'Evaluate arithmetic expressions respecting operator precedence (PEMDAS)'
    ],
    estimatedHours: 5,
    lessons: [
      {
        id: 'les-2-1',
        moduleId: 'mod-2',
        order: 1,
        title: 'Variables, Memory Model & Naming Rules',
        slug: 'variables-and-memory-model',
        difficulty: 'beginner',
        durationMinutes: 25,
        prerequisites: ['les-1-3'],
        learningObjectives: [
          'Understand that Python variables are tagged references/pointers to objects, not memory boxes',
          'Follow PEP 8 snake_case naming conventions',
          'Identify Python keywords that cannot be used as variable names'
        ],
        concepts: ['Variables as Labels', 'id() and Memory Address', 'Reference Counting', 'PEP 8 Naming'],
        summary: 'In Python, a variable is not a storage box; it is a human-friendly label bound to an object residing in memory.',
        starterCode: `# Inspect object identity with id()
a = [1, 2, 3]
b = a  # b points to the SAME list in memory!
c = [1, 2, 3] # c is a NEW list with identical contents

print("id(a):", id(a))
print("id(b):", id(b))
print("id(c):", id(c))
print("a is b:", a is b)
print("a is c:", a is c)
`,
        sections: [
          {
            id: 'sec-2-1-1',
            title: 'Variables Are References, Not Boxes',
            content: `In languages like C or Java, a variable is a typed storage box in memory.
In Python, **everything is an object**. When you write \`x = 10\`:
1. Python creates an integer object \`10\` in heap memory.
2. The name \`x\` is bound as a reference to that object.
3. If you write \`y = x\`, \`y\` now points to the **same** object \`10\`!

### Python Variable Naming Rules:
- Must begin with a letter (a-z, A-Z) or an underscore (\`_\`).
- Cannot start with a digit (\`1st_place\` is illegal!).
- Can only contain alphanumeric characters and underscores (\`a-z, 0-9, _\`).
- Case-sensitive: \`score\`, \`Score\`, and \`SCORE\` are three distinct variables.
- Cannot be a reserved keyword (\`for\`, \`while\`, \`if\`, \`class\`, \`def\`, etc.).`,
            codeExamples: [
              {
                title: 'Variable Binding & Swapping Values',
                description: 'Python allows elegant tuple-unpacking swaps without temporary variables.',
                code: `# Swapping values in Python
x = 100
y = 200

print(f"Before swap: x={x}, y={y}")

# Pythonic swap via tuple packing/unpacking
x, y = y, x

print(f"After swap:  x={x}, y={y}")
`,
                expectedOutput: `Before swap: x=100, y=200
After swap:  x=200, y=100`,
                lineByLine: [
                  { line: 'x, y = y, x', explanation: 'Right-side values (y, x) are packed into a tuple (200, 100), then unpacked into identifiers x and y in one atomic statement.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Using Python built-in names as variable names',
                why: 'Naming a variable `str`, `list`, `type`, or `print` shadows the built-in function, causing subsequent calls to fail.',
                fix: 'Never name your variables after built-in types or functions.',
                badCode: 'list = [1, 2, 3]\nnew_items = list("abc") # TypeError: list object not callable!',
                goodCode: 'item_list = [1, 2, 3]\nnew_items = list("abc")'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-2-1',
          title: 'Lesson 2.1 Knowledge Check',
          moduleId: 'mod-2',
          lessonId: 'les-2-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-2-1-1',
              type: 'mcq',
              question: 'Which of the following is an INVALID variable name in Python?',
              options: ['_student_id', 'totalScore2', '2nd_attempt', 'MAX_BUFFER_SIZE'],
              correctOptionIndex: 2,
              explanation: 'Variable names in Python cannot start with a numeric digit. `2nd_attempt` will raise a SyntaxError.'
            },
            {
              id: 'q-2-1-2',
              type: 'predict-output',
              question: 'What is the output of this code?',
              codeSnippet: 'a = 5\nb = a\na = 10\nprint(b)',
              options: ['10', '5', 'None', 'Error'],
              correctOptionIndex: 1,
              explanation: 'Integers are immutable. `a = 10` binds `a` to a new integer object `10`. `b` remains bound to `5`.'
            }
          ]
        }
      },
      {
        id: 'les-2-2',
        moduleId: 'mod-2',
        order: 2,
        title: 'Core Primitive Data Types & Type Conversion',
        slug: 'core-types-and-casting',
        difficulty: 'beginner',
        durationMinutes: 30,
        prerequisites: ['les-2-1'],
        learningObjectives: [
          'Master int, float, str, and bool',
          'Use type() and isinstance() to inspect types safely',
          'Convert safely between types using int(), float(), str(), and bool()',
          'Understand floating-point precision characteristics (IEEE 754)'
        ],
        concepts: ['int', 'float', 'str', 'bool', 'isinstance()', 'Type Casting', 'IEEE 754'],
        summary: 'Python provides four fundamental primitive data types: int for whole numbers, float for real decimals, str for Unicode text, and bool for truth values.',
        starterCode: `# Inspecting and converting data types
raw_price = "49.99"
quantity = 3

price_float = float(raw_price)
total = price_float * quantity

print(f"Total: \${total:.2f}")
print("Type of total:", type(total).__name__)
print("Is total a float?", isinstance(total, float))
`,
        sections: [
          {
            id: 'sec-2-2-1',
            title: 'Primitive Types & Truthiness',
            content: `Python primitives:
- **int:** Arbitrary precision whole numbers (no integer overflow limit in Python 3!).
- **float:** 64-bit IEEE 754 double precision floating point numbers.
- **str:** Immutable sequences of Unicode code points.
- **bool:** Subclass of int with values \`True\` (1) and \`False\` (0).

### Type Casting Rules:
- \`int("42")\` -> \`42\`
- \`int(3.99)\` -> \`3\` (truncates toward zero, does NOT round!)
- \`float("3.14")\` -> \`3.14\`
- \`str(100)\` -> \`"100"\`
- \`bool(0)\`, \`bool("")\`, \`bool([])\`, \`bool(None)\` -> \`False\` (everything empty is falsy!)`,
            codeExamples: [
              {
                title: 'The Truthiness of Objects in Python',
                description: 'Testing how various values evaluate to booleans.',
                code: `values_to_test = [0, 42, "", "Python", [], [1, 2], None, 0.0]

for val in values_to_test:
    print(f"Value: {repr(val):<10} -> bool(): {bool(val)}")
`,
                expectedOutput: `Value: 0          -> bool(): False
Value: 42         -> bool(): True
Value: ''         -> bool(): False
Value: 'Python'   -> bool(): True
Value: []         -> bool(): False
Value: [1, 2]     -> bool(): True
Value: None       -> bool(): False
Value: 0.0        -> bool(): False`,
                lineByLine: [
                  { line: 'repr(val)', explanation: 'Returns a string containing a printable representation of an object (including quotes for strings).' },
                  { line: 'bool(val)', explanation: 'Evaluates the truthiness of the value according to standard Python truth value testing.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Attempting int("3.14") directly',
                why: 'int() cannot parse a string with decimal points directly; it expects whole number characters.',
                fix: 'First convert to float, then to int: int(float("3.14")).',
                badCode: 'num = int("3.14") # ValueError: invalid literal for int() with base 10',
                goodCode: 'num = int(float("3.14")) # Result: 3'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-2-2',
          title: 'Lesson 2.2 Knowledge Check',
          moduleId: 'mod-2',
          lessonId: 'les-2-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-2-2-1',
              type: 'predict-output',
              question: 'What is the output of `print(int(7.99))` in Python?',
              codeSnippet: 'print(int(7.99))',
              options: ['8', '7', '7.0', 'ValueError'],
              correctOptionIndex: 1,
              explanation: 'int() on a float truncates toward zero by removing the decimal portion, yielding 7 (not rounding to 8).'
            },
            {
              id: 'q-2-2-2',
              type: 'predict-output',
              question: 'What does `print(bool("False"))` evaluate to?',
              codeSnippet: 'print(bool("False"))',
              options: ['False', 'True', 'None', 'TypeError'],
              correctOptionIndex: 1,
              explanation: 'Any non-empty string in Python evaluates to True, even if the text happens to be "False"!'
            }
          ]
        }
      },
      {
        id: 'les-2-3',
        moduleId: 'mod-2',
        order: 3,
        title: 'Input, Operators & Expression Precedence',
        slug: 'input-and-operators',
        difficulty: 'beginner',
        durationMinutes: 30,
        prerequisites: ['les-2-2'],
        learningObjectives: [
          'Capture user data with input() and handle string return values',
          'Use arithmetic operators: +, -, *, /, // (floor div), % (modulus), ** (exponent)',
          'Evaluate operator precedence according to PEMDAS rules'
        ],
        concepts: ['input()', 'Floor Division (//)', 'Modulus (%)', 'Exponent (**)', 'Operator Precedence'],
        summary: 'All data returned by input() is of type string. Arithmetic operators follow PEMDAS precedence, with // calculating integer division and % computing remainders.',
        starterCode: `# Demonstration of division vs floor division and remainder
dividend = 17
divisor = 5

quotient = dividend / divisor       # Float division
floor_quot = dividend // divisor    # Floor division (integer quotient)
remainder = dividend % divisor      # Modulus

print(f"{dividend} / {divisor}  = {quotient}")
print(f"{dividend} // {divisor} = {floor_quot}")
print(f"{dividend} % {divisor}  = {remainder}")
print(f"Check: ({divisor} * {floor_quot}) + {remainder} == {divisor * floor_quot + remainder}")
`,
        sections: [
          {
            id: 'sec-2-3-1',
            title: 'Operators & Precedence Hierarchy',
            content: `### Arithmetic Operators in Python:
| Operator | Name | Example | Result |
| :--- | :--- | :--- | :--- |
| \`+\` | Addition | \`5 + 2\` | \`7\` |
| \`-\` | Subtraction | \`5 - 2\` | \`3\` |
| \`*\` | Multiplication | \`5 * 2\` | \`10\` |
| \`/\` | Float Division | \`5 / 2\` | \`2.5\` (always float) |
| \`//\` | Floor Division | \`5 // 2\` | \`2\` (rounds down to nearest integer) |
| \`%\` | Modulo | \`5 % 2\` | \`1\` (remainder) |
| \`**\` | Exponentiation | \`5 ** 2\` | \`25\` |

### Precedence Table (High to Low):
1. Parentheses: \`()\`
2. Exponentiation: \`**\` (Right-to-left evaluation: \`2 ** 3 ** 2 == 2 ** 9 == 512\`)
3. Unary signs: \`+x\`, \`-x\`
4. Multiplicative: \`*\`, \`/\`, \`//\`, \`%\`
5. Additive: \`+\`, \`-\``,
            codeExamples: [
              {
                title: 'Order of Operations in Action',
                description: 'Testing expressions where parentheses alter evaluation flow.',
                code: `res1 = 10 + 2 * 3 ** 2
# Evaluation: 3**2 = 9 -> 2*9 = 18 -> 10+18 = 28
print("10 + 2 * 3 ** 2 =", res1)

res2 = (10 + 2) * 3 ** 2
# Evaluation: (10+2)=12 -> 3**2=9 -> 12*9 = 108
print("(10 + 2) * 3 ** 2 =", res2)
`,
                expectedOutput: `10 + 2 * 3 ** 2 = 28
(10 + 2) * 3 ** 2 = 108`,
                lineByLine: [
                  { line: 'res1 = 10 + 2 * 3 ** 2', explanation: 'Exponent ** runs first, followed by multiplication *, followed by addition +.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Adding two input() results directly expecting arithmetic sum',
                why: 'input() always returns strings; "+" will concatenate strings rather than add numbers.',
                fix: 'Cast input() to int() or float() before mathematical operations.',
                badCode: 'a = "10"\nb = "20"\nprint(a + b) # Outputs "1020"',
                goodCode: 'a = int("10")\nb = int("20")\nprint(a + b) # Outputs 30'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-2-3',
          title: 'Lesson 2.3 Knowledge Check',
          moduleId: 'mod-2',
          lessonId: 'les-2-3',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-2-3-1',
              type: 'predict-output',
              question: 'What is the value of `2 ** 3 ** 2` in Python?',
              codeSnippet: 'print(2 ** 3 ** 2)',
              options: ['64', '512', '36', 'SyntaxError'],
              correctOptionIndex: 1,
              explanation: 'Exponentiation in Python is right-associative: `3 ** 2` is evaluated first to `9`, then `2 ** 9` equals `512`.'
            },
            {
              id: 'q-2-3-2',
              type: 'predict-output',
              question: 'What is the output of `print(19 // 4, 19 % 4)`?',
              codeSnippet: 'print(19 // 4, 19 % 4)',
              options: ['4 3', '4.75 3', '4.0 3.0', '5 1'],
              correctOptionIndex: 0,
              explanation: '19 // 4 gives integer quotient 4, and 19 % 4 gives remainder 3 (since 4 * 4 + 3 = 19).'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-2',
      title: 'Module 2 Assessment: Variables and Data Types',
      moduleId: 'mod-2',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-2-1',
          type: 'mcq',
          question: 'What happens in memory when you execute `x = [1, 2]` followed by `y = x`?',
          options: [
            'Python clones the list so x and y have independent copies.',
            'x and y point to the exact same list object in memory.',
            'y becomes a string copy of x.',
            'A MemoryError is raised.'
          ],
          correctOptionIndex: 1,
          explanation: 'Assignment binds names to objects. Both `x` and `y` reference the identical list instance in heap memory.'
        },
        {
          id: 'cq-2-2',
          type: 'predict-output',
          question: 'What does `type(10 / 2)` return in Python 3?',
          codeSnippet: 'print(type(10 / 2))',
          options: ["<class 'int'>", "<class 'float'>", "<class 'number'>", "<class 'double'>"],
          correctOptionIndex: 1,
          explanation: 'In Python 3, the single slash division operator `/` always produces a float, so `10 / 2` yields `5.0` which is a `<class \'float\'>`.'
        },
        {
          id: 'cq-2-3',
          type: 'find-bug',
          question: 'Which line causes a runtime exception?',
          codeSnippet: 'val1 = int("15")\nval2 = float("3.5")\nval3 = int("7.2")\nprint(val1, val2, val3)',
          options: ['Line 1', 'Line 2', 'Line 3', 'Line 4'],
          correctOptionIndex: 2,
          explanation: '`int("7.2")` throws `ValueError: invalid literal for int() with base 10: \'7.2\'` because int() cannot directly convert a string containing a decimal period.'
        },
        {
          id: 'cq-2-4',
          type: 'mcq',
          question: 'Which of the following evaluates to `False` in Python boolean context?',
          options: ['" "', '[-1]', '0.0', '"False"'],
          correctOptionIndex: 2,
          explanation: 'Numeric zero `0.0` is falsy. Strings with spaces or characters and non-empty lists are truthy.'
        },
        {
          id: 'cq-2-5',
          type: 'predict-output',
          question: 'What is the output of `print(14 % 5)`?',
          codeSnippet: 'print(14 % 5)',
          options: ['2.8', '2', '4', '1'],
          correctOptionIndex: 2,
          explanation: '14 divided by 5 is 2 with a remainder of 4. `14 % 5 == 4`.'
        }
      ]
    }
  },
  {
    id: 'mod-3',
    order: 3,
    number: 3,
    title: 'Conditional Statements',
    slug: 'conditional-statements',
    tagline: 'Flow control, logical operators, short-circuit evaluation & decision logic',
    description: 'Learn how to give your programs decision-making intelligence using if, elif, else, logical chaining (and, or, not), and truthy/falsy evaluation.',
    difficulty: 'beginner',
    iconName: 'GitFork',
    prerequisites: ['mod-2'],
    learningObjectives: [
      'Construct branching logic with if, elif, and else statements',
      'Use comparison operators: ==, !=, >, <, >=, <=',
      'Combine conditions with logical operators (and, or, not)',
      'Understand and leverage short-circuit boolean evaluation',
      'Write safe, nested conditionals and guard clauses'
    ],
    estimatedHours: 4,
    lessons: [
      {
        id: 'les-3-1',
        moduleId: 'mod-3',
        order: 1,
        title: 'if, elif, else & Comparison Operators',
        slug: 'if-elif-else-basics',
        difficulty: 'beginner',
        durationMinutes: 25,
        prerequisites: ['les-2-3'],
        learningObjectives: [
          'Understand indentation syntax (PEP 8 standard 4 spaces)',
          'Structure multi-way decision trees with if-elif-else',
          'Avoid the equality assignment bug (`=` vs `==`)'
        ],
        concepts: ['Indentation', 'Colons', 'if-elif-else', 'Comparison Operators', 'Guard Clauses'],
        summary: 'Conditional statements allow programs to execute specific blocks of code based on whether a boolean expression evaluates to True.',
        starterCode: `# Grading system using clean if-elif-else structure
score = 87

if score >= 90:
    grade = "A"
    feedback = "Outstanding mastery!"
elif score >= 80:
    grade = "B"
    feedback = "Solid understanding."
elif score >= 70:
    grade = "C"
    feedback = "Satisfactory, keep practicing."
else:
    grade = "D"
    feedback = "Revision recommended."

print(f"Score: {score} -> Grade: {grade} ({feedback})")
`,
        sections: [
          {
            id: 'sec-3-1-1',
            title: 'Indentation is Python\'s Structure',
            content: `Unlike C, Java, or JavaScript which use curly braces \`{}\` to define code blocks, **Python uses indentation**.
The standard indentation is **4 spaces per level**.

Syntax structure:
\`\`\`python
if condition1:
    # executed if condition1 is True
elif condition2:
    # executed if condition1 is False AND condition2 is True
else:
    # executed if all preceding conditions are False
\`\`\`

Python executes **only the first branch** whose condition evaluates to True, and skips all remaining branches!`,
            codeExamples: [
              {
                title: 'Chained Comparison in Python',
                description: 'Python uniquely supports mathematical chained comparisons like `0 <= x <= 100`.',
                code: `age = 22

# Idiomatic Python chained comparison
if 18 <= age <= 65:
    print(f"Age {age}: Eligible for workforce programs.")
else:
    print(f"Age {age}: Outside standard program bracket.")
`,
                expectedOutput: `Age 22: Eligible for workforce programs.`,
                lineByLine: [
                  { line: 'if 18 <= age <= 65:', explanation: 'Shorthand for `if age >= 18 and age <= 65:`. Evaluates age only once.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Using = (assignment) instead of == (comparison)',
                why: '`=` binds a value to a variable, whereas `==` checks for equality.',
                fix: 'Use `==` when testing whether two values are equal.',
                badCode: '# In older Python versions or inside expressions:\n# if x = 5: -> SyntaxError',
                goodCode: 'if x == 5:\n    print("x is five")'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-3-1',
          title: 'Lesson 3.1 Knowledge Check',
          moduleId: 'mod-3',
          lessonId: 'les-3-1',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-3-1-1',
              type: 'predict-output',
              question: 'What will this code print?',
              codeSnippet: 'x = 15\nif x > 20:\n    print("High")\nelif x > 10:\n    print("Medium")\nelif x > 5:\n    print("Low")\nelse:\n    print("None")',
              options: ['High', 'Medium', 'Medium and Low', 'None'],
              correctOptionIndex: 1,
              explanation: 'Because `x > 10` is True, "Medium" is printed and the elif/else chain immediately terminates.'
            },
            {
              id: 'q-3-1-2',
              type: 'mcq',
              question: 'What is the PEP 8 recommended indentation in Python?',
              options: ['2 spaces', '4 spaces', '1 tab character', '8 spaces'],
              correctOptionIndex: 1,
              explanation: 'PEP 8 specifies exactly 4 spaces per indentation level.'
            }
          ]
        }
      },
      {
        id: 'les-3-2',
        moduleId: 'mod-3',
        order: 2,
        title: 'Logical Operators & Short-Circuit Evaluation',
        slug: 'logical-operators-short-circuit',
        difficulty: 'beginner',
        durationMinutes: 25,
        prerequisites: ['les-3-1'],
        learningObjectives: [
          'Master boolean logical operators: and, or, not',
          'Understand short-circuit evaluation and its performance benefits',
          'Leverage short-circuiting as safe guard clauses to prevent ZeroDivisionError or IndexError'
        ],
        concepts: ['and', 'or', 'not', 'Short-Circuiting', 'Guard Clauses'],
        summary: 'Python evaluates and/or expressions from left to right and stops as soon as the outcome is determined. This is known as short-circuit evaluation.',
        starterCode: `# Safe guard clause using short-circuit evaluation
def safe_divide(numerator, denominator):
    # If denominator is 0, the right side is NEVER evaluated!
    if denominator != 0 and numerator / denominator > 10:
        return f"High ratio: {numerator / denominator:.1f}"
    return "Safe default ratio or zero divisor"

print(safe_divide(100, 2))
print(safe_divide(50, 0)) # No ZeroDivisionError because of short-circuit!
`,
        sections: [
          {
            id: 'sec-3-2-1',
            title: 'How Short-Circuiting Works',
            content: `### Rules of Short-Circuit Evaluation:
- **\`A and B\`**: If \`A\` is \`False\`, Python does **not** evaluate \`B\`, because the result is guaranteed to be \`False\`.
- **\`A or B\`**: If \`A\` is \`True\`, Python does **not** evaluate \`B\`, because the result is guaranteed to be \`True\`.

### Values Returned by \`and\` and \`or\`:
In Python, \`and\` and \`or\` do not simply return \`True\` or \`False\`; they return the **actual operand value** that decided the result!
- \`"Python" or "Default"\` -> \`"Python"\` (first truthy value)
- \`"" or "Default"\` -> \`"Default"\`
- \`"Alice" and "Bob"\` -> \`"Bob"\` (evaluates both, returns last)`,
            codeExamples: [
              {
                title: 'Default Values Using `or` Idiom',
                description: 'Using `or` to supply fallback values for empty user inputs.',
                code: `username_input = ""
display_name = username_input or "Anonymous Guest"
print("Welcome,", display_name)

filled_input = "CodeNinja"
display_name = filled_input or "Anonymous Guest"
print("Welcome,", display_name)
`,
                expectedOutput: `Welcome, Anonymous Guest
Welcome, CodeNinja`,
                lineByLine: [
                  { line: 'display_name = username_input or "Anonymous Guest"', explanation: 'If username_input is empty (""), it is falsy, so Python evaluates and returns the fallback string.' }
                ]
              }
            ],
            pitfalls: [
              {
                pitfall: 'Chaining multiple `or` conditions incorrectly',
                why: 'Writing `if x == "a" or "b":` does NOT mean `if x is "a" or x is "b"`. Because `"b"` is a non-empty string, it is always truthy!',
                fix: 'Write `if x == "a" or x == "b":` or use membership: `if x in ("a", "b"):`.',
                badCode: 'x = "c"\nif x == "a" or "b":\n    print("Matched!") # ALWAYS PRINTS!',
                goodCode: 'x = "c"\nif x in ("a", "b"):\n    print("Matched!")'
              }
            ]
          }
        ],
        knowledgeCheck: {
          id: 'quiz-3-2',
          title: 'Lesson 3.2 Knowledge Check',
          moduleId: 'mod-3',
          lessonId: 'les-3-2',
          passingScorePercent: 70,
          questions: [
            {
              id: 'q-3-2-1',
              type: 'predict-output',
              question: 'What is the result of `print([] or "Python")` in Python?',
              codeSnippet: 'print([] or "Python")',
              options: ['[]', 'True', 'Python', 'False'],
              correctOptionIndex: 2,
              explanation: 'An empty list `[]` is falsy, so `or` proceeds to the second operand and returns `"Python"`.'
            },
            {
              id: 'q-3-2-2',
              type: 'predict-output',
              question: 'What does this code output?',
              codeSnippet: 'x = 0\nif x != 0 and (10 / x > 1):\n    print("Pass")\nelse:\n    print("Fail")',
              options: ['ZeroDivisionError', 'Pass', 'Fail', 'None'],
              correctOptionIndex: 2,
              explanation: 'Because `x != 0` evaluates to `False`, the `and` short-circuits. `(10 / x > 1)` is never evaluated, preventing a ZeroDivisionError, and the else branch outputs "Fail".'
            }
          ]
        }
      }
    ],
    chapterQuiz: {
      id: 'chapter-quiz-3',
      title: 'Module 3 Assessment: Conditional Logic',
      moduleId: 'mod-3',
      passingScorePercent: 80,
      questions: [
        {
          id: 'cq-3-1',
          type: 'predict-output',
          question: 'What does the following snippet print?',
          codeSnippet: 'val = 25\nif val < 20:\n    print("A")\nelif val < 30:\n    print("B")\nelif val < 40:\n    print("C")\nelse:\n    print("D")',
          options: ['A', 'B', 'B and C', 'C'],
          correctOptionIndex: 1,
          explanation: 'Only the first branch whose condition evaluates to True is executed. `25 < 30` is True, printing "B".'
        },
        {
          id: 'cq-3-2',
          type: 'find-bug',
          question: 'What is the logical flaw in this code?',
          codeSnippet: 'status = "inactive"\nif status == "active" or "pending":\n    print("Access Granted")',
          options: [
            'status cannot be compared to strings',
            '"pending" is a non-empty string which evaluates to True, so Access Granted always executes regardless of status',
            'Missing colon on line 2',
            'or should be replaced with and'
          ],
          correctOptionIndex: 1,
          explanation: 'Because `"pending"` evaluates to True in boolean context, `status == "active" or "pending"` will always be truthy.'
        },
        {
          id: 'cq-3-3',
          type: 'predict-output',
          question: 'What does `print(not (True and False))` evaluate to?',
          codeSnippet: 'print(not (True and False))',
          options: ['False', 'True', 'None', 'SyntaxError'],
          correctOptionIndex: 1,
          explanation: '`True and False` is `False`. The `not` operator inverts `False` to `True`.'
        },
        {
          id: 'cq-3-4',
          type: 'mcq',
          question: 'Which statement is used as a placeholder inside an empty if block to prevent a SyntaxError?',
          options: ['void', 'pass', 'continue', 'null'],
          correctOptionIndex: 1,
          explanation: '`pass` is a null statement in Python used when a statement is required syntactically but no code needs to be executed.'
        },
        {
          id: 'cq-3-5',
          type: 'predict-output',
          question: 'What is printed by: `print("Admin" if True else "User")`?',
          codeSnippet: 'print("Admin" if True else "User")',
          options: ['Admin', 'User', 'True', 'None'],
          correctOptionIndex: 0,
          explanation: 'This is Python\'s ternary conditional expression: `<expr1> if <condition> else <expr2>`. Since condition is True, it returns "Admin".'
        }
      ]
    }
  }
];
