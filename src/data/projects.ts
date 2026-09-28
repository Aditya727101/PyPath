import { Project } from '../types/curriculum';

export const allProjects: Project[] = [
  {
    id: 'proj-1',
    order: 1,
    title: 'Command-Line Calculator',
    difficulty: 'beginner',
    tagline: 'Build an interactive arithmetic engine with input validation and memory recall',
    description: 'Create a versatile command-line calculator that performs continuous operations (+, -, *, /, //, %, **), handles ZeroDivisionError gracefully, and stores a running memory variable.',
    learningGoals: [
      'Master while loops for continuous interactive CLI loops',
      'Safely parse and convert numeric inputs with try-except',
      'Implement state persistence with a memory recall feature'
    ],
    requirements: [
      'Support basic arithmetic operations: addition, subtraction, multiplication, and true division',
      'Support advanced operations: exponentiation, integer floor division, and modulus',
      'Guard against zero division without crashing the program',
      'Allow user to use the previous answer as input for the next calculation (Ans feature)',
      'Provide a clean command to exit the program gracefully'
    ],
    starterCode: `# Command-Line Calculator Starter Code
def calculator():
    memory = 0.0
    print("=== PyPath CLI Calculator ===")
    print("Available operators: +, -, *, /, //, %, **")
    print("Commands: 'ans' to reuse last result, 'clear' to reset, 'quit' to exit")

    while True:
        # TODO: Implement interactive arithmetic calculation loop
        choice = input("\\nEnter calculation or 'quit': ").strip()
        if choice.lower() == 'quit':
            print("Thank you for using PyPath Calculator. Goodbye!")
            break
        print(f"You entered: {choice}")
        break # Remove this break once implementing your loop

if __name__ == "__main__":
    calculator()
`,
    hints: [
      'Use .split() on the user input string to separate the operands and the operator: num1, op, num2 = parts',
      'Check if the first operand is "ans" (case-insensitive) and substitute the stored memory float value',
      'Wrap float conversion and division inside a try-except block to catch ValueError and ZeroDivisionError'
    ],
    solutionCode: `def calculator():
    memory = 0.0
    print("=== PyPath CLI Calculator ===")
    print("Available operators: +, -, *, /, //, %, **")
    print("Type: [number] [operator] [number], or 'quit' to exit")
    
    while True:
        raw = input("\\ncalc> ").strip()
        if raw.lower() == "quit":
            print("Session ended.")
            break
        if raw.lower() == "clear":
            memory = 0.0
            print("Memory cleared to 0.0")
            continue
            
        parts = raw.split()
        if len(parts) != 3:
            print("Error: Please format as '[num1] [op] [num2]' (e.g. '15 + 4')")
            continue
            
        n1_str, op, n2_str = parts
        try:
            n1 = memory if n1_str.lower() == "ans" else float(n1_str)
            n2 = memory if n2_str.lower() == "ans" else float(n2_str)
        except ValueError:
            print("Error: Operands must be valid numbers or 'ans'.")
            continue
            
        try:
            if op == "+": res = n1 + n2
            elif op == "-": res = n1 - n2
            elif op == "*": res = n1 * n2
            elif op == "/": res = n1 / n2
            elif op == "//": res = n1 // n2
            elif op == "%": res = n1 % n2
            elif op == "**": res = n1 ** n2
            else:
                print(f"Error: Unknown operator '{op}'")
                continue
                
            memory = res
            print(f"Result: {res}")
        except ZeroDivisionError:
            print("Math Error: Cannot divide or modulo by zero.")

if __name__ == "__main__":
    calculator()
`,
    checklist: [
      { id: 'c1', label: 'Continuous while loop with clean exit condition' },
      { id: 'c2', label: 'Accurate evaluation of all 7 arithmetic operators' },
      { id: 'c3', label: 'ZeroDivisionError and ValueError caught and reported' },
      { id: 'c4', label: 'Memory recall variable (Ans) retains previous answer' }
    ],
    verificationCriteria: 'Program continuously computes mathematical expressions, handles malformed inputs without crashing, and permits memory chaining.'
  },
  {
    id: 'proj-2',
    order: 2,
    title: 'Smart Number Guessing Game',
    difficulty: 'beginner',
    tagline: 'Binary search intuition, dynamic hint generation, and high-score tracking',
    description: 'Design a number guessing game with custom difficulty levels, dynamic feedback ("Much higher", "Slightly lower"), attempt limits, and optimal binary search target analytics.',
    learningGoals: [
      'Generate random integers with random.randint()',
      'Structure scoring heuristics based on remaining attempts',
      'Compute optimal theoretical steps using logarithmic calculation math.ceil(math.log2(N))'
    ],
    requirements: [
      'Offer Easy (1-50, 8 attempts), Medium (1-100, 7 attempts), and Hard (1-500, 9 attempts)',
      'Provide contextual proximity feedback based on how close the guess was',
      'Display score based on remaining attempts and difficulty multiplier',
      'Compare player attempts against optimal Binary Search strategy'
    ],
    starterCode: `import random
import math

def number_guessing_game():
    print("=== PyPath Number Guessing Challenge ===")
    # Select difficulty and bounds
    low, high = 1, 100
    target = random.randint(low, high)
    optimal_steps = math.ceil(math.log2(high - low + 1))
    
    print(f"Target selected between {low} and {high}!")
    print(f"Optimal binary search would solve this in {optimal_steps} attempts.\\n")

if __name__ == "__main__":
    number_guessing_game()
`,
    hints: [
      'Calculate the difference diff = abs(guess - target) to give proximity clues like "Boiling hot!" or "Ice cold!"',
      'Keep track of past guesses in a list or set to prevent penalizing the player for repeated inputs'
    ],
    solutionCode: `import random
import math

def play_game(low=1, high=100, max_attempts=7):
    secret = random.randint(low, high)
    optimal = math.ceil(math.log2(high - low + 1))
    attempts_used = 0
    history = []
    
    print(f"\\nGuess the secret number between {low} and {high}.")
    print(f"You have {max_attempts} attempts. Optimal Binary Search needs {optimal} steps.")
    
    while attempts_used < max_attempts:
        raw = input(f"Attempt {attempts_used + 1}/{max_attempts} - Enter guess: ").strip()
        try:
            guess = int(raw)
        except ValueError:
            print("Please enter a valid integer.")
            continue
            
        if guess < low or guess > high:
            print(f"Out of range! Please stay between {low} and {high}.")
            continue
            
        attempts_used += 1
        history.append(guess)
        
        if guess == secret:
            score = (max_attempts - attempts_used + 1) * 100
            print(f"🎉 BINGO! You guessed {secret} in {attempts_used} attempts!")
            print(f"Your final score: {score} pts")
            return
        elif guess < secret:
            diff = secret - guess
            clue = "Very close! (Higher)" if diff <= 5 else "Higher!"
            print(clue)
        else:
            diff = guess - secret
            clue = "Very close! (Lower)" if diff <= 5 else "Lower!"
            print(clue)
            
    print(f"Game Over! The secret number was {secret}. Try again!")

if __name__ == "__main__":
    play_game()
`,
    checklist: [
      { id: 'c1', label: 'Random number generation within bounded range' },
      { id: 'c2', label: 'Proximity feedback (Higher/Lower with distance indicators)' },
      { id: 'c3', label: 'Attempt limits enforced with game over handling' },
      { id: 'c4', label: 'Score calculation based on remaining attempts' }
    ],
    verificationCriteria: 'Game validates range and types, guides user with directional hints, and tracks attempts accurately.'
  },
  {
    id: 'proj-3',
    order: 3,
    title: 'Interactive Quiz Application',
    difficulty: 'beginner',
    tagline: 'Question banks, timed answers, multiple-choice parsing, and performance reports',
    description: 'Build an automated quiz evaluator that loads questions from structured data, shuffles options, calculates percentages, and prints detailed post-test diagnostic reports.',
    learningGoals: [
      'Structure questions as dictionaries and lists',
      'Use random.shuffle to randomize option positions',
      'Produce formatted completion summaries with pass/fail criteria'
    ],
    requirements: [
      'Store question bank with questions, options, correct answers, and explanations',
      'Shuffle question order and answer options dynamically',
      'Prevent duplicate or invalid input options (accept A, B, C, D)',
      'Calculate percentage and display review of incorrect questions'
    ],
    starterCode: `def run_quiz():
    questions = [
        {
            "prompt": "What is the output of print(type([]))?",
            "options": ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"],
            "answer": 0,
            "explanation": "Square brackets [] instantiate a list."
        }
    ]
    print("Welcome to the PyPath Python Assessment!")

if __name__ == "__main__":
    run_quiz()
`,
    hints: [
      'Map index 0, 1, 2, 3 to A, B, C, D using ord("A") + index or a letter lookup tuple ("A", "B", "C", "D")',
      'Keep a record of questions missed to present a targeted review at the end'
    ],
    solutionCode: `import random

QUESTIONS = [
    {
        "q": "What is the return type of input() in Python?",
        "options": ["int", "str", "bool", "float"],
        "correct": 1,
        "why": "input() always returns user input as a string (str)."
    },
    {
        "q": "Which collection is immutable?",
        "options": ["list", "dict", "tuple", "set"],
        "correct": 2,
        "why": "Tuples cannot be modified once instantiated."
    },
    {
        "q": "What does 'break' do inside a loop?",
        "options": ["Skips current iteration", "Terminates the loop immediately", "Restarts the loop", "Deletes the variable"],
        "correct": 1,
        "why": "'break' abruptly exits the innermost enclosing loop."
    }
]

def conduct_quiz():
    score = 0
    incorrect = []
    
    print("=== PyPath Academy Quiz Engine ===")
    for idx, item in enumerate(QUESTIONS, start=1):
        print(f"\\nQuestion {idx}: {item['q']}")
        labels = ["A", "B", "C", "D"]
        for opt_idx, text in enumerate(item["options"]):
            print(f"  [{labels[opt_idx]}] {text}")
            
        choice = ""
        while choice not in labels:
            choice = input("Your answer (A/B/C/D): ").strip().upper()
            
        selected_idx = labels.index(choice)
        if selected_idx == item["correct"]:
            print("✓ Correct!")
            score += 1
        else:
            print(f"✗ Incorrect. Correct was [{labels[item['correct']]}]")
            incorrect.append((item, choice))
            
    pct = (score / len(QUESTIONS)) * 100
    print(f"\\n--- Results ---")
    print(f"Score: {score}/{len(QUESTIONS)} ({pct:.1f}%)")
    print("Status:", "PASSED 🎉" if pct >= 70 else "FAILED - Practice Recommended")

if __name__ == "__main__":
    conduct_quiz()
`,
    checklist: [
      { id: 'c1', label: 'Structured question bank iteration' },
      { id: 'c2', label: 'Option letter validation (A, B, C, D)' },
      { id: 'c3', label: 'Accurate percentage scoring and pass/fail calculation' },
      { id: 'c4', label: 'Post-quiz review of missed questions with explanations' }
    ],
    verificationCriteria: 'Evaluates inputs deterministically, calculates score percentages, and outputs formatted reviews.'
  },
  {
    id: 'proj-4',
    order: 4,
    title: 'To-Do Task Management System',
    difficulty: 'intermediate',
    tagline: 'CRUD operations, JSON persistence, priority queues, and deadline tracking',
    description: 'Build a production-grade task manager supporting task creation, priority levels, category tags, completion status toggles, search filtering, and automatic JSON file persistence.',
    learningGoals: [
      'Implement full CRUD (Create, Read, Update, Delete) patterns',
      'Serialize tasks to disk using json.dump() and json.load()',
      'Filter and sort task records by priority and status'
    ],
    requirements: [
      'Add tasks with title, description, priority (Low/Medium/High), and tag',
      'Mark tasks completed, pending, or archived',
      'List tasks with formatted status checkboxes [x] / [ ]',
      'Filter tasks by tag or completion status',
      'Persist all data to tasks.json between runs'
    ],
    starterCode: `import json
import os

TASKS_FILE = "tasks.json"

def load_tasks():
    # TODO: Load JSON from file or return empty list
    return []

def save_tasks(tasks):
    # TODO: Save tasks list to tasks.json
    pass

def main():
    print("=== PyPath Task Manager ===")

if __name__ == "__main__":
    main()
`,
    hints: [
      'Assign an incrementing integer ID to each task for easy reference in edit/delete commands',
      'Use ISO timestamps datetime.now().isoformat() to record when tasks are created and completed'
    ],
    solutionCode: `import json
import os
from datetime import datetime

class TaskManager:
    def __init__(self, filename="tasks.json"):
        self.filename = filename
        self.tasks = self.load()

    def load(self):
        if not os.path.exists(self.filename):
            return []
        try:
            with open(self.filename, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []

    def save(self):
        with open(self.filename, "w", encoding="utf-8") as f:
            json.dump(self.tasks, f, indent=2)

    def add(self, title, priority="Medium", tag="General"):
        task_id = max([t["id"] for t in self.tasks], default=0) + 1
        new_task = {
            "id": task_id,
            "title": title,
            "priority": priority,
            "tag": tag,
            "done": False,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        self.tasks.append(new_task)
        self.save()
        print(f"Task #{task_id} added.")

    def list_tasks(self, filter_done=None):
        filtered = self.tasks if filter_done is None else [t for t in self.tasks if t["done"] == filter_done]
        if not filtered:
            print("No matching tasks found.")
            return
        print("\\nID  | Status | Priority | Tag      | Title")
        print("----+--------+----------+----------+--------------------------")
        for t in filtered:
            st = "[X]" if t["done"] else "[ ]"
            print(f"{t['id']:<3} | {st:<6} | {t['priority']:<8} | {t['tag']:<8} | {t['title']}")

    def toggle(self, task_id):
        for t in self.tasks:
            if t["id"] == task_id:
                t["done"] = not t["done"]
                self.save()
                print(f"Task #{task_id} marked as {'Completed' if t['done'] else 'Pending'}.")
                return
        print(f"Task #{task_id} not found.")

if __name__ == "__main__":
    tm = TaskManager("demo_tasks.json")
    tm.add("Study Python Generators", "High", "Education")
    tm.add("Write unit tests", "Medium", "Dev")
    tm.list_tasks()
`,
    checklist: [
      { id: 'c1', label: 'Load and save task list from/to JSON' },
      { id: 'c2', label: 'Add task with ID, priority, and tags' },
      { id: 'c3', label: 'Toggle task completion state' },
      { id: 'c4', label: 'Formatted tabular display of tasks' }
    ],
    verificationCriteria: 'Manages task states, handles file operations cleanly, and formats task tables.'
  },
  {
    id: 'proj-5',
    order: 5,
    title: 'Digital Contact Book',
    difficulty: 'intermediate',
    tagline: 'Regex validation, dictionary indexing, CSV export, and fuzzy search',
    description: 'Create an address book with name, email, phone number, and category. Validate phone numbers and emails using regex, search by partial substring, and export to CSV.',
    learningGoals: [
      'Validate inputs with re.match() regex patterns',
      'Perform case-insensitive substring searching',
      'Export structured records using the standard csv module'
    ],
    requirements: [
      'Add contacts with name, phone, email, and relationship category',
      'Validate phone format and email format with regex',
      'Search contacts by partial name or phone number',
      'Export contacts to a standard contacts.csv file'
    ],
    starterCode: `import re
import csv

class ContactBook:
    def __init__(self):
        self.contacts = {} # phone -> contact dict

if __name__ == "__main__":
    print("=== PyPath Contact Book ===")
`,
    hints: [
      'Use re.match(r"^\\+?\\d{7,15}$", phone) for flexible phone number validation',
      'Use csv.DictWriter with fieldnames to write dictionary records directly to CSV'
    ],
    solutionCode: `import re
import csv

class ContactBook:
    def __init__(self):
        self.contacts = []

    def validate_email(self, email):
        return bool(re.match(r"^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$", email))

    def validate_phone(self, phone):
        return bool(re.match(r"^\\+?\\d{10,15}$", phone.replace("-", "").replace(" ", "")))

    def add_contact(self, name, phone, email, category="Personal"):
        if not self.validate_email(email):
            print("Invalid email format.")
            return False
        if not self.validate_phone(phone):
            print("Invalid phone format (need 10-15 digits).")
            return False
            
        self.contacts.append({
            "name": name,
            "phone": phone,
            "email": email,
            "category": category
        })
        print(f"Contact '{name}' saved successfully.")
        return True

    def search(self, query):
        q = query.lower()
        results = [c for c in self.contacts if q in c["name"].lower() or q in c["phone"]]
        return results

    def export_csv(self, filename="contacts.csv"):
        with open(filename, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["name", "phone", "email", "category"])
            writer.writeheader()
            writer.writerows(self.contacts)
        print(f"Exported {len(self.contacts)} contacts to {filename}")

if __name__ == "__main__":
    cb = ContactBook()
    cb.add_contact("Maya Patel", "+1-555-0144", "maya@example.com", "Work")
    print("Search results for 'maya':", cb.search("maya"))
`,
    checklist: [
      { id: 'c1', label: 'Regex validation for email and phone numbers' },
      { id: 'c2', label: 'Case-insensitive substring search' },
      { id: 'c3', label: 'CSV export using csv.DictWriter' }
    ],
    verificationCriteria: 'Validates contact inputs, handles substring searches, and produces valid CSV files.'
  },
  {
    id: 'proj-6',
    order: 6,
    title: 'Personal Expense & Budget Tracker',
    difficulty: 'intermediate',
    tagline: 'Financial analytics, category breakdown, monthly aggregates, and spending alerts',
    description: 'Track spending habits with categorised expenses. Calculate total monthly burn rates, breakdown by categories (Food, Rent, Tech, Leisure), and alert when spending breaches defined budget thresholds.',
    learningGoals: [
      'Aggregate numerical data by category groups using dictionaries',
      'Compute percentages and summary statistics',
      'Enforce budget threshold warnings'
    ],
    requirements: [
      'Log expenses with date, category, amount, and notes',
      'Summarise total expenses and percentage breakdown by category',
      'Set monthly budgets per category and trigger alert messages when spending exceeds 90% or 100%',
      'Display spending report with ASCII bar visualisations'
    ],
    starterCode: `class ExpenseTracker:
    def __init__(self, monthly_budget=2000.0):
        self.budget = monthly_budget
        self.expenses = []

if __name__ == "__main__":
    print("=== PyPath Expense Tracker ===")
`,
    hints: [
      'Use collections.defaultdict(float) to simplify summing expenses by category',
      'Build ASCII bars with "#" * int(percentage / 5) for quick visual reports'
    ],
    solutionCode: `from collections import defaultdict

class ExpenseTracker:
    def __init__(self, budget_limits=None):
        self.budget_limits = budget_limits or {"Food": 400, "Rent": 1000, "Tech": 200, "Fun": 150}
        self.expenses = []

    def log(self, category, amount, description=""):
        self.expenses.append({"category": category, "amount": amount, "desc": description})
        current_cat_total = sum(e["amount"] for e in self.expenses if e["category"] == category)
        limit = self.budget_limits.get(category, 500)
        
        if current_cat_total > limit:
            print(f"⚠️  BUDGET ALERT: {category} spending (\${current_cat_total:.2f}) exceeds limit of \${limit:.2f}!")
        elif current_cat_total >= limit * 0.9:
            print(f"🔔 Warning: {category} spending is at {current_cat_total/limit*100:.0f}% of budget limit.")

    def summary(self):
        totals = defaultdict(float)
        for e in self.expenses:
            totals[e["category"]] += e["amount"]
        grand_total = sum(totals.values())
        
        print("\\n=== Expense Summary ===")
        print(f"Total Expenditure: \${grand_total:.2f}")
        for cat, amt in totals.items():
            pct = (amt / grand_total * 100) if grand_total else 0
            bar = "#" * int(pct // 5)
            print(f"{cat:<10} | \${amt:>7.2f} ({pct:>5.1f}%) | {bar}")

if __name__ == "__main__":
    et = ExpenseTracker()
    et.log("Food", 120, "Weekly groceries")
    et.log("Food", 290, "Dining out")
    et.log("Tech", 185, "Keyboard purchase")
    et.summary()
`,
    checklist: [
      { id: 'c1', label: 'Categorised expense recording' },
      { id: 'c2', label: 'Category totals and percentage computation' },
      { id: 'c3', label: 'Budget alert thresholds triggered on overspending' },
      { id: 'c4', label: 'Visual ASCII summary chart' }
    ],
    verificationCriteria: 'Accurately calculates sums, fires budget threshold warnings, and formats output summaries.'
  },
  {
    id: 'proj-7',
    order: 7,
    title: 'Automated File Organiser',
    difficulty: 'intermediate',
    tagline: 'Pathlib filesystem manipulation, file extension sorting, and safe directory batching',
    description: 'Organise messy download folders into sorted directories (Images, Documents, Code, Archives, Audio) based on file extensions using pathlib.Path and shutil.',
    learningGoals: [
      'Traverse directories using pathlib.Path',
      'Extract file extensions using path.suffix',
      'Safely create directories and move files'
    ],
    requirements: [
      'Map file extensions to target categories (.png -> Images, .py -> Code, etc.)',
      'Create target directories if they do not exist',
      'Move files while preventing overwrite collisions if duplicate names exist',
      'Generate an organisation audit log detailing files relocated'
    ],
    starterCode: `from pathlib import Path
import shutil

EXTENSION_MAP = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".svg"],
    "Documents": [".pdf", ".docx", ".txt", ".md"],
    "Code": [".py", ".js", ".ts", ".html", ".css"],
    "Archives": [".zip", ".tar", ".gz"]
}

def organize_directory(target_path):
    # TODO: Implement file sorting
    pass
`,
    hints: [
      'Use Path(target_path).iterdir() to iterate files in a folder',
      'Check if item.is_file() before attempting to move'
    ],
    solutionCode: `from pathlib import Path

def simulate_file_organizer(file_list):
    EXTENSION_MAP = {
        "Images": [".jpg", ".png", ".svg"],
        "Documents": [".pdf", ".docx", ".txt"],
        "Code": [".py", ".ts", ".html"],
        "Archives": [".zip", ".tar"]
    }
    
    actions = []
    for filename in file_list:
        p = Path(filename)
        ext = p.suffix.lower()
        assigned_category = "Miscellaneous"
        for category, extensions in EXTENSION_MAP.items():
            if ext in extensions:
                assigned_category = category
                break
        actions.append((filename, assigned_category))
        
    print("=== File Organization Plan ===")
    for fname, folder in actions:
        print(f"Move '{fname}' -> /{folder}/")
    return actions

if __name__ == "__main__":
    sample_files = ["script.py", "photo.png", "notes.txt", "archive.zip", "data.unknown"]
    simulate_file_organizer(sample_files)
`,
    checklist: [
      { id: 'c1', label: 'Extension extraction using pathlib.Path' },
      { id: 'c2', label: 'Mapping extensions to target directory categories' },
      { id: 'c3', label: 'Handling unknown extensions gracefully into Miscellaneous' }
    ],
    verificationCriteria: 'Accurately categorises file paths by suffix and plans clean directory moves.'
  },
  {
    id: 'proj-8',
    order: 8,
    title: 'Student Marks & Academic Analytics Manager',
    difficulty: 'intermediate',
    tagline: 'Statistical calculations, GPA ranking, grade distribution, and CSV report cards',
    description: 'Build an educational analytics engine that computes class averages, medians, standard deviations, generates grade distributions, and exports student report cards.',
    learningGoals: [
      'Calculate statistics (mean, median, variance) without external libraries',
      'Implement multi-level student sorting by aggregate scores',
      'Format academic report cards with letter grade cutoffs'
    ],
    requirements: [
      'Record student scores across multiple subjects (Math, Science, English, Code)',
      'Calculate individual GPA and letter grades (A, B, C, D, F)',
      'Calculate class mean, highest, and lowest scores per subject',
      'Rank students in descending order of performance'
    ],
    starterCode: `class Gradebook:
    def __init__(self):
        self.students = {}

if __name__ == "__main__":
    print("=== PyPath Academic Analytics ===")
`,
    hints: [
      'Convert percentage to GPA: >=90 -> 4.0, >=80 -> 3.0, >=70 -> 2.0, etc.',
      'Use sorted(students, key=lambda s: s.average(), reverse=True) to rank students'
    ],
    solutionCode: `class StudentRecord:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks # dict: subject -> score

    def average(self):
        return sum(self.marks.values()) / max(len(self.marks), 1)

    def grade(self):
        avg = self.average()
        if avg >= 90: return "A"
        if avg >= 80: return "B"
        if avg >= 70: return "C"
        if avg >= 60: return "D"
        return "F"

class ClassAnalytics:
    def __init__(self):
        self.roster = []

    def add_student(self, name, marks):
        self.roster.append(StudentRecord(name, marks))

    def generate_report(self):
        sorted_students = sorted(self.roster, key=lambda s: s.average(), reverse=True)
        print("Rank | Student Name      | Average | Grade")
        print("-----+-------------------+---------+-------")
        for rank, s in enumerate(sorted_students, start=1):
            print(f"{rank:<4} | {s.name:<17} | {s.average():>7.2f} | {s.grade()}")

if __name__ == "__main__":
    ca = ClassAnalytics()
    ca.add_student("Elena Rostova", {"Math": 95, "Science": 92, "Code": 99})
    ca.add_student("Marcus Vance", {"Math": 82, "Science": 78, "Code": 88})
    ca.add_student("Sara Chen", {"Math": 88, "Science": 94, "Code": 91})
    ca.generate_report()
`,
    checklist: [
      { id: 'c1', label: 'StudentRecord data representation' },
      { id: 'c2', label: 'Average and letter grade computation' },
      { id: 'c3', label: 'Class ranking by academic average' }
    ],
    verificationCriteria: 'Computes averages accurately, assigns correct letter grades, and produces ranked rosters.'
  },
  {
    id: 'proj-9',
    order: 9,
    title: 'Weather Information & Forecast Dashboard',
    difficulty: 'advanced',
    tagline: 'API response simulation, caching with TTL, weather metric parsing, and climate warnings',
    description: 'Build a weather client architecture that queries meteorological endpoints, parses temperature/humidity/wind speed, caches results to minimise network calls, and outputs weather warnings.',
    learningGoals: [
      'Structure API requests and parse JSON response payloads',
      'Implement in-memory cache with time-to-live (TTL) expiration',
      'Format weather alerts (Heat advisory, Storm watch, Freeze warning)'
    ],
    requirements: [
      'Parse weather metrics (Celsius, Fahrenheit, humidity, wind velocity, precipitation chance)',
      'Cache city weather queries for 10 minutes to save API quotas',
      'Provide contextual weather alerts based on temperature and wind thresholds'
    ],
    starterCode: `import time

class WeatherService:
    def __init__(self):
        self.cache = {} # city -> (timestamp, data)

if __name__ == "__main__":
    print("=== PyPath Weather Service ===")
`,
    hints: [
      'Check time.time() - cached_time < 600 to verify if cached data is still fresh'
    ],
    solutionCode: `import time

class WeatherService:
    def __init__(self, ttl_seconds=600):
        self.ttl = ttl_seconds
        self.cache = {}
        # Pre-seeded mock meteorological telemetry
        self.mock_db = {
            "tokyo": {"temp_c": 19, "humidity": 65, "condition": "Partly Cloudy", "wind_kph": 12},
            "london": {"temp_c": 13, "humidity": 82, "condition": "Light Rain", "wind_kph": 24},
            "new york": {"temp_c": 26, "humidity": 55, "condition": "Sunny", "wind_kph": 15},
            "reykjavik": {"temp_c": 1, "humidity": 70, "condition": "Snow Flurries", "wind_kph": 35}
        }

    def get_weather(self, city):
        c_key = city.lower().strip()
        now = time.time()
        
        # Check cache freshness
        if c_key in self.cache:
            saved_time, data = self.cache[c_key]
            if now - saved_time < self.ttl:
                print(f"[CACHE HIT] Fresh data loaded for {city.title()}")
                return data
                
        # Simulate network fetch
        if c_key in self.mock_db:
            data = self.mock_db[c_key]
            self.cache[c_key] = (now, data)
            print(f"[NETWORK FETCH] Retrieved live telemetry for {city.title()}")
            return data
            
        return None

    def display(self, city):
        data = self.get_weather(city)
        if not data:
            print(f"Weather data unavailable for '{city}'.")
            return
        temp_f = (data["temp_c"] * 9/5) + 32
        print(f"\\nWeather in {city.title()}:")
        print(f"  Condition: {data['condition']}")
        print(f"  Temperature: {data['temp_c']}°C ({temp_f:.1f}°F)")
        print(f"  Humidity: {data['humidity']}% | Wind: {data['wind_kph']} km/h")
        if data["temp_c"] <= 2:
            print("  ⚠️ ALERT: Freezing conditions detected.")
        elif data["wind_kph"] >= 30:
            print("  ⚠️ ALERT: High wind advisory in effect.")

if __name__ == "__main__":
    ws = WeatherService()
    ws.display("Tokyo")
    ws.display("Tokyo") # Cache hit!
    ws.display("Reykjavik")
`,
    checklist: [
      { id: 'c1', label: 'Weather metric parsing and Fahrenheit conversion' },
      { id: 'c2', label: 'TTL cache checking to minimize redundant requests' },
      { id: 'c3', label: 'Severe weather advisory triggers' }
    ],
    verificationCriteria: 'Parses temperatures, verifies cache freshness, and issues appropriate climate warnings.'
  },
  {
    id: 'proj-10',
    order: 10,
    title: 'Text-Based RPG Adventure Game',
    difficulty: 'advanced',
    tagline: 'OOP state machines, combat calculation, inventory systems, and narrative branching',
    description: 'Architect an immersive dungeon crawler. Model hero classes (Warrior, Mage, Rogue), dynamic monster encounters, turn-based combat with critical strikes, inventory management, and branching narrative paths.',
    learningGoals: [
      'Design interconnected object models with inheritance',
      'Implement turn-based combat math with dice rolls and defense calculations',
      'Maintain player state across multiple narrative rooms'
    ],
    requirements: [
      'Player entity with Health, Mana, Attack, Defense, and Inventory',
      'Monster classes with varying abilities and loot drops',
      'Turn-based combat loop (Attack, Cast Spell, Use Potion, Flee)',
      'Game over and victory conditions'
    ],
    starterCode: `class Character:
    def __init__(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.attack = attack

if __name__ == "__main__":
    print("=== PyPath Dungeon Crawler ===")
`,
    hints: [
      'Use random.uniform(0.85, 1.15) to introduce combat variance so hits are not identical',
      'Separate monster turn logic from player turn logic in clean methods'
    ],
    solutionCode: `import random

class Fighter:
    def __init__(self, name, hp, max_hp, atk, defense):
        self.name = name
        self.hp = hp
        self.max_hp = max_hp
        self.atk = atk
        self.defense = defense

    def is_alive(self):
        return self.hp > 0

    def take_damage(self, raw_dmg):
        effective = max(raw_dmg - self.defense, 1)
        self.hp = max(self.hp - effective, 0)
        return effective

class Player(Fighter):
    def __init__(self, name):
        super().__init__(name, hp=100, max_hp=100, atk=20, defense=5)
        self.potions = 2

    def heal(self):
        if self.potions > 0:
            self.potions -= 1
            healed = min(35, self.max_hp - self.hp)
            self.hp += healed
            print(f"✨ {self.name} drank a potion and restored {healed} HP! ({self.potions} left)")
        else:
            print("No potions remaining!")

def battle(player, monster):
    print(f"\\n⚔️  A wild {monster.name} emerges! (HP: {monster.hp})")
    while player.is_alive() and monster.is_alive():
        print(f"\\n{player.name} HP: {player.hp}/{player.max_hp} | {monster.name} HP: {monster.hp}")
        action = input("Choose: [1] Strike  [2] Potion: ").strip()
        if action == "2":
            player.heal()
        else:
            dmg = int(player.atk * random.uniform(0.9, 1.2))
            dealt = monster.take_damage(dmg)
            print(f"💥 You struck {monster.name} for {dealt} damage!")
            
        if monster.is_alive():
            m_dmg = int(monster.atk * random.uniform(0.8, 1.1))
            taken = player.take_damage(m_dmg)
            print(f"💢 {monster.name} attacked back for {taken} damage!")
            
    if player.is_alive():
        print(f"🏆 You defeated {monster.name}!")
        return True
    else:
        print("💀 You were defeated in battle...")
        return False

if __name__ == "__main__":
    hero = Player("Kaelen the Brave")
    goblin = Fighter("Cave Goblin", 45, 45, 12, 2)
    battle(hero, goblin)
`,
    checklist: [
      { id: 'c1', label: 'Object-oriented Fighter and Player models' },
      { id: 'c2', label: 'Turn-based combat resolution with damage calculation' },
      { id: 'c3', label: 'Consumables inventory (potions) and healing logic' }
    ],
    verificationCriteria: 'Manages character stats, turn sequencing, and victory/defeat termination.'
  },
  {
    id: 'proj-11',
    order: 11,
    title: 'Mini Library Management System',
    difficulty: 'advanced',
    tagline: 'Book catalogs, member lending accounts, overdue fine calculators, and transactional search',
    description: 'Design a library administration system with Book entities, Member accounts, loan checkouts/returns, ISBN validation, search indexing, and overdue fine computation.',
    learningGoals: [
      'Model relational entity interactions (Book, Member, Transaction)',
      'Enforce business validation rules (maximum active loans, overdue fines)',
      'Manage date calculations with datetime and timedelta'
    ],
    requirements: [
      'Book catalog tracking Title, Author, ISBN, and availability status',
      'Member accounts with loan history and active checkouts',
      'Check-out and check-in workflows preventing borrowing already loaned books',
      'Calculate overdue late fees based on loan durations'
    ],
    starterCode: `class Book:
    def __init__(self, isbn, title, author):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.is_borrowed = False

class Library:
    def __init__(self):
        self.catalog = {}
        self.members = {}

if __name__ == "__main__":
    print("=== PyPath Library System ===")
`,
    hints: [
      'Record datetime.now() when a book is checked out to calculate elapsed days upon return'
    ],
    solutionCode: `from datetime import datetime, timedelta

class Book:
    def __init__(self, isbn, title, author):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.borrower_id = None
        self.due_date = None

class Library:
    def __init__(self):
        self.books = {} # isbn -> Book

    def add_book(self, isbn, title, author):
        self.books[isbn] = Book(isbn, title, author)
        print(f"Book added: '{title}' by {author} (ISBN: {isbn})")

    def checkout(self, isbn, member_id, loan_days=14):
        book = self.books.get(isbn)
        if not book:
            print("Book not found.")
            return False
        if book.borrower_id:
            print(f"Cannot checkout: already loaned to member {book.borrower_id}")
            return False
            
        book.borrower_id = member_id
        book.due_date = datetime.now() + timedelta(days=loan_days)
        print(f"Success: '{book.title}' checked out to {member_id}. Due: {book.due_date.strftime('%Y-%m-%d')}")
        return True

    def return_book(self, isbn):
        book = self.books.get(isbn)
        if not book or not book.borrower_id:
            print("Book is not currently on loan.")
            return
        borrower = book.borrower_id
        book.borrower_id = None
        book.due_date = None
        print(f"'{book.title}' returned successfully by member {borrower}.")

if __name__ == "__main__":
    lib = Library()
    lib.add_book("978-0134685991", "Effective Python", "Brett Slatkin")
    lib.checkout("978-0134685991", "MEMBER_101")
    lib.checkout("978-0134685991", "MEMBER_102") # Fails gracefully
    lib.return_book("978-0134685991")
`,
    checklist: [
      { id: 'c1', label: 'Catalog management with ISBN keys' },
      { id: 'c2', label: 'Loan state tracking with due dates' },
      { id: 'c3', label: 'Rejection of checkout attempts on already borrowed books' }
    ],
    verificationCriteria: 'Maintains catalog integrity, enforces loan limits, and tracks borrower state.'
  },
  {
    id: 'proj-12',
    order: 12,
    title: 'Full Capstone: Automated Analytics Engine',
    difficulty: 'advanced',
    tagline: 'Complete architecture: parsing, validation, statistics, OOP models, and export pipeline',
    description: 'The crowning capstone project: build an end-to-end data processing and analytics engine combining file I/O, OOP models, custom exceptions, sorting algorithms, type annotations, and automated testing.',
    learningGoals: [
      'Integrate all 12 modules into a cohesive, production-grade application',
      'Build clean separation of concerns: ingestion, processing, analytics, and reporting',
      'Include comprehensive unit tests and error handling'
    ],
    requirements: [
      'Parse raw CSV data streams and sanitize records',
      'Compute statistical metrics (percentiles, standard deviations, distributions)',
      'Filter and rank datasets using custom criteria',
      'Generate a final markdown / JSON summary report',
      'Demonstrate clean PEP 8 design, docstrings, and type hints'
    ],
    starterCode: `from dataclasses import dataclass
from typing import List, Dict, Optional
import json

@dataclass
class DataPoint:
    id: int
    category: str
    value: float

class AnalyticsPipeline:
    def __init__(self):
        self.records: List[DataPoint] = []

if __name__ == "__main__":
    print("=== PyPath Capstone Analytics Engine ===")
`,
    hints: [
      'Apply lessons learned across all 12 modules: context managers, decorators, dataclasses, and unittest'
    ],
    solutionCode: `from dataclasses import dataclass
from typing import List, Dict
import math

@dataclass
class MetricRecord:
    metric_id: str
    category: str
    score: float

class CapstoneEngine:
    def __init__(self):
        self.records: List[MetricRecord] = []

    def ingest(self, raw_data: List[Dict]):
        for item in raw_data:
            rec = MetricRecord(
                metric_id=str(item["id"]),
                category=str(item["category"]).strip().title(),
                score=float(item["score"])
            )
            self.records.append(rec)

    def stats(self, category: str = None) -> Dict:
        subset = [r.score for r in self.records if (category is None or r.category == category)]
        if not subset:
            return {"count": 0, "mean": 0.0, "std_dev": 0.0}
        n = len(subset)
        mean = sum(subset) / n
        variance = sum((x - mean) ** 2 for x in subset) / max(n - 1, 1)
        return {
            "count": n,
            "mean": round(mean, 2),
            "std_dev": round(math.sqrt(variance), 2),
            "min": min(subset),
            "max": max(subset)
        }

    def generate_report(self):
        overall = self.stats()
        categories = sorted(list(set(r.category for r in self.records)))
        print("================ CAPSTONE ANALYTICS REPORT ================")
        print(f"Total Records Ingested: {overall['count']}")
        print(f"Overall Mean Score:     {overall['mean']} ± {overall['std_dev']}")
        print(f"Score Range:            [{overall['min']} to {overall['max']}]\\n")
        print("Category Breakdown:")
        for cat in categories:
            cat_stats = self.stats(cat)
            print(f"  • {cat:<15}: Mean {cat_stats['mean']} (Count: {cat_stats['count']})")
        print("===========================================================")

if __name__ == "__main__":
    engine = CapstoneEngine()
    engine.ingest([
        {"id": 1, "category": "Algorithms", "score": 92},
        {"id": 2, "category": "Algorithms", "score": 85},
        {"id": 3, "category": "Web Dev", "score": 78},
        {"id": 4, "category": "Data Science", "score": 95},
        {"id": 5, "category": "Data Science", "score": 88},
    ])
    engine.generate_report()
`,
    checklist: [
      { id: 'c1', label: 'Dataclass modeling with static type hints' },
      { id: 'c2', label: 'Mathematical mean and standard deviation computation' },
      { id: 'c3', label: 'Categorical segmentation and reporting' },
      { id: 'c4', label: 'Clean CLI diagnostic report generation' }
    ],
    verificationCriteria: 'Demonstrates end-to-end data modeling, statistical rigor, and cohesive architectural structure.'
  }
];
