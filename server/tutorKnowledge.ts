/**
 * Offline educational knowledge fallback and response cache for PyPath AI Tutor.
 * Provides instant responses for common beginner questions and resilient fallback.
 */

interface KnowledgeItem {
  keywords: string[];
  reply: string;
}

export const COMMON_PYTHON_TOPICS: KnowledgeItem[] = [
  {
    keywords: ['variable', 'what is a variable', 'variables'],
    reply: `A variable in Python is a named label that stores a value in computer memory. You create one simply by assigning a value using the \`=\` sign, without needing to declare any type.\n\n\`\`\`python\nname = "Alice"\nage = 16\n\`\`\`\nPython figures out the data type automatically!`,
  },
  {
    keywords: ['list vs tuple', 'difference between list and tuple', 'tuple vs list', 'tuple and list'],
    reply: `The main difference is **mutability**: lists can be changed after creation, while tuples cannot.\n\n\`\`\`python\nmy_list = [1, 2, 3]    # Mutable (can add, remove, change)\nmy_tuple = (1, 2, 3)   # Immutable (fixed in stone)\n\`\`\`\nUse lists for collections that will change, and tuples for fixed data like coordinates.`,
  },
  {
    keywords: ['indentation', 'indentationerror', 'unexpected indent', 'indent error'],
    reply: `In Python, indentation (spaces at the start of a line) defines code blocks instead of curly braces \`{}\`.\n\nAlways use **4 spaces** for each block level inside functions, loops, and \`if\` statements. Mixing tabs and spaces or missing an indent will cause an \`IndentationError\`.`,
  },
  {
    keywords: ['range', 'how does range work', 'range()'],
    reply: `The \`range()\` function generates a sequence of numbers, usually used with \`for\` loops.\n\n\`\`\`python\nfor i in range(1, 5):\n    print(i)  # Prints 1, 2, 3, 4 (stops before 5)\n\`\`\`\nIt takes \`range(start, stop, step)\`. If you pass one number like \`range(3)\`, it starts at \`0\` and stops at \`2\`.`,
  },
  {
    keywords: ['input', 'user input', 'input()', 'take input'],
    reply: `The \`input()\` function pauses your program and lets the user type something in the console. It always returns the answer as a string (\`str\`).\n\n\`\`\`python\nname = input("Enter your name: ")\nage = int(input("Enter your age: "))  # convert to integer if doing math\n\`\`\`\nUse \`int()\` or \`float()\` if you need numerical calculations!`,
  },
  {
    keywords: ['for loop', 'how does for loop work', 'loops'],
    reply: `A \`for\` loop in Python iterates through items in any sequence, like a list, string, or range.\n\n\`\`\`python\nfruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(f"I like {fruit}!")\n\`\`\`\nPython handles moving to the next item automatically.`,
  },
  {
    keywords: ['dictionary', 'dict', 'what is a dictionary', 'dictionaries'],
    reply: `A Python dictionary stores data in **key-value pairs**, enclosed in curly braces \`{}\`.\n\n\`\`\`python\nstudent = {"name": "Sara", "grade": 10, "passed": True}\nprint(student["name"])  # Outputs: Sara\n\`\`\`\nKeys must be unique and immutable (like strings or numbers).`,
  },
  {
    keywords: ['f-string', 'format string', 'f string', 'string formatting'],
    reply: `F-strings (formatted string literals) allow you to embed variables directly into strings by putting an \`f\` before the opening quote and wrapping expressions in \`{}\`.\n\n\`\`\`python\nscore = 95\nprint(f"Great job! Your score is {score}/100.")\n\`\`\`\nThey are fast, clean, and the modern standard in Python 3.6+.`,
  },
  {
    keywords: ['len', 'len()', 'what does len do'],
    reply: `The \`len()\` function returns the number of items in an object, such as characters in a string or elements in a list.\n\n\`\`\`python\nprint(len("Python"))  # Outputs: 6\nprint(len([10, 20]))  # Outputs: 2\n\`\`\`\nIt works on strings, lists, tuples, sets, and dictionaries.`,
  },
  {
    keywords: ['function', 'def', 'how to create a function', 'functions'],
    reply: `You define a function in Python using the \`def\` keyword, followed by the function name and parentheses \`()\`, ending with a colon \`:\`.\n\n\`\`\`python\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Maya"))\n\`\`\`\nUse functions to organize code into reusable, readable pieces.`,
  },
];

// Simple in-memory LRU cache with TTL (1 hour)
interface CacheEntry {
  reply: string;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();
const MAX_CACHE_SIZE = 200;

export function getCachedTutorResponse(key: string): string | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.reply;
}

export function setCachedTutorResponse(key: string, reply: string, ttlMs: number = 3600000): void {
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
  responseCache.set(key, { reply, expiresAt: Date.now() + ttlMs });
}

export function findCurriculumFallback(query: string): string | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  for (const item of COMMON_PYTHON_TOPICS) {
    for (const kw of item.keywords) {
      if (q === kw || (q.length > 5 && q.includes(kw))) {
        return item.reply;
      }
    }
  }

  // Handle off-topic or empty
  if (q.length < 2) {
    return "Hi! How can I help you with your Python code or concepts today?";
  }

  if (q.includes('java') || q.includes('c++') || q.includes('c#') || q.includes('rust') || q.includes('javascript')) {
    return "I specialize specifically in Python! If you have a question on how to write that in Python or how Python compares, let me know.";
  }

  return null;
}
