export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LineExplanation {
  line: string;
  explanation: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  expectedOutput?: string;
  lineByLine?: LineExplanation[];
}

export interface DryRunStep {
  step: number;
  lineNumber: number;
  code: string;
  variables: Record<string, string>;
  output?: string;
  note: string;
}

export interface PitfallItem {
  pitfall: string;
  why: string;
  fix: string;
  badCode: string;
  goodCode: string;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string; // Markdown / styled text
  codeExamples?: CodeExample[];
  dryRun?: DryRunStep[];
  pitfalls?: PitfallItem[];
  realWorldContext?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
  hidden?: boolean;
}

export type QuestionType = 'mcq' | 'multi-select' | 'predict-output' | 'find-bug' | 'fill-blank' | 'code-test';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctOptionIndex?: number;
  correctOptionIndices?: number[];
  expectedOutput?: string;
  blanksAnswer?: string[];
  explanation: string;
  testCases?: TestCase[];
}

export interface Quiz {
  id: string;
  title: string;
  moduleId: string;
  lessonId?: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  prerequisites: string[];
  learningObjectives: string[];
  concepts: string[];
  summary: string;
  sections: LessonSection[];
  starterCode: string;
  knowledgeCheck?: Quiz;
}

export interface Module {
  id: string;
  order: number;
  number: number;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  difficulty: DifficultyLevel;
  iconName: string;
  prerequisites: string[];
  learningObjectives: string[];
  estimatedHours: number;
  lessons: Lesson[];
  chapterQuiz: Quiz;
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  moduleId: string;
  problemStatement: string;
  constraints?: string[];
  starterCode: string;
  hints: string[];
  testCases: TestCase[];
  solutionCode: string;
  explanation: string;
}

export interface ProjectChecklistItem {
  id: string;
  label: string;
  description?: string;
}

export interface Project {
  id: string;
  order: number;
  title: string;
  difficulty: DifficultyLevel;
  tagline: string;
  description: string;
  learningGoals: string[];
  requirements: string[];
  starterCode: string;
  hints: string[];
  solutionCode: string;
  checklist: ProjectChecklistItem[];
  verificationCriteria: string;
}

export interface BookmarkItem {
  id: string;
  targetType: 'lesson' | 'exercise' | 'project' | 'question';
  targetId: string;
  title: string;
  category: string;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  content: string;
  updatedAt: string;
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  moduleId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  attemptedAt: string;
  userAnswers: Record<string, any>;
}
