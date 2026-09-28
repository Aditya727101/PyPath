import { Module, Lesson } from '../../types/curriculum';
import { modules1_3 } from './modules1_3';
import { modules4_6 } from './modules4_6';
import { modules7_9 } from './modules7_9';
import { modules10_12 } from './modules10_12';
import { allProjects } from '../projects';

// Module 13 represents the guided real-world projects portfolio
export const module13: Module = {
  id: 'mod-13',
  order: 13,
  number: 13,
  title: 'Real-World Guided Projects',
  slug: 'real-world-projects',
  tagline: '12 guided software projects: CLI tools, games, financial trackers, and analytics engines',
  description: 'Apply everything you have learned across the 12 modules. Build production-grade software projects with starter templates, interactive test runners, requirements checklists, and solution breakdowns.',
  difficulty: 'advanced',
  iconName: 'FolderKanban',
  prerequisites: ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5', 'mod-6', 'mod-7', 'mod-8', 'mod-9', 'mod-10', 'mod-11', 'mod-12'],
  learningObjectives: [
    'Synthesize foundational, intermediate, and advanced Python skills into working software',
    'Follow modern software engineering lifecycles: specification -> design -> coding -> testing -> refactoring',
    'Build a portfolio of 12 complete Python applications'
  ],
  estimatedHours: 25,
  lessons: allProjects.map((p, idx) => ({
    id: `les-13-${p.order}`,
    moduleId: 'mod-13',
    order: p.order,
    title: `Project ${p.order}: ${p.title}`,
    slug: `project-${p.order}-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    difficulty: p.difficulty,
    durationMinutes: 90,
    prerequisites: idx === 0 ? ['mod-1', 'mod-2'] : [`les-13-${idx}`],
    learningObjectives: p.learningGoals,
    concepts: ['Project Engineering', 'State Design', 'Error Resilience', 'Testing'],
    summary: p.description,
    starterCode: p.starterCode,
    sections: [
      {
        id: `sec-13-${p.order}-1`,
        title: 'Project Brief & Specifications',
        content: `### Objective:
${p.description}

### Core Requirements:
${p.requirements.map(r => '* ' + r).join('\n')}

### Success & Verification Criteria:
${p.verificationCriteria}`,
        codeExamples: [
          {
            title: 'Reference Implementation',
            description: 'Study how components connect and interact.',
            code: p.solutionCode,
            expectedOutput: 'Clean terminal execution without unhandled exceptions.'
          }
        ],
        pitfalls: [
          {
            pitfall: 'Skipping edge cases and defensive checks',
            why: 'User input and file I/O frequently encounter unexpected values or missing paths.',
            fix: 'Wrap external interactions in try-except blocks and validate data shapes early.',
            badCode: '# Directly indexing user input without length checks',
            goodCode: '# Validating input length and types prior to processing'
          }
        ]
      }
    ]
  })),
  chapterQuiz: {
    id: 'chapter-quiz-13',
    title: 'Module 13 Capstone Knowledge Check',
    moduleId: 'mod-13',
    passingScorePercent: 80,
    questions: [
      {
        id: 'cq-13-1',
        type: 'mcq',
        question: 'What is the primary benefit of decomposing an application into distinct modules and classes?',
        options: [
          'It makes the code file larger.',
          'Separation of concerns, enhanced testability, and isolated maintainability.',
          'It allows programs to bypass operating system security.',
          'It prevents other developers from reading your code.'
        ],
        correctOptionIndex: 1,
        explanation: 'Modularity creates clear boundaries, making systems easier to test, debug, and maintain.'
      },
      {
        id: 'cq-13-2',
        type: 'mcq',
        question: 'When building CLI applications, why is input validation critical?',
        options: [
          'Users never make mistakes.',
          'Malformed input can cause uncaught exceptions, infinite loops, or system crashes.',
          'Python crashes automatically if input is not validated within 3 seconds.',
          'It changes text to bold automatically.'
        ],
        correctOptionIndex: 1,
        explanation: 'Input validation guards programs against runtime exceptions and unexpected user actions.'
      }
    ]
  }
};

export const allCurriculumModules: Module[] = [
  ...modules1_3,
  ...modules4_6,
  ...modules7_9,
  ...modules10_12,
  module13
];

// Flat list of all lessons across all modules
export const allCurriculumLessons: Lesson[] = allCurriculumModules.flatMap(m => m.lessons);

export function findModuleById(moduleId: string): Module | undefined {
  return allCurriculumModules.find(m => m.id === moduleId);
}

export function findLessonById(lessonId: string): Lesson | undefined {
  return allCurriculumLessons.find(l => l.id === lessonId);
}

export function findAdjacentLessons(lessonId: string): { prev?: Lesson; next?: Lesson; currentModule?: Module } {
  const currentIndex = allCurriculumLessons.findIndex(l => l.id === lessonId);
  if (currentIndex === -1) return {};

  const currentLesson = allCurriculumLessons[currentIndex];
  const currentModule = findModuleById(currentLesson.moduleId);

  return {
    prev: currentIndex > 0 ? allCurriculumLessons[currentIndex - 1] : undefined,
    next: currentIndex < allCurriculumLessons.length - 1 ? allCurriculumLessons[currentIndex + 1] : undefined,
    currentModule
  };
}

export function searchCurriculum(queryText: string): { module: Module; lesson: Lesson; matchedText: string }[] {
  const q = queryText.toLowerCase().trim();
  if (!q) return [];

  const results: { module: Module; lesson: Lesson; matchedText: string }[] = [];

  for (const mod of allCurriculumModules) {
    for (const les of mod.lessons) {
      if (les.title.toLowerCase().includes(q)) {
        results.push({ module: mod, lesson: les, matchedText: `Title: ${les.title}` });
        continue;
      }
      if (les.concepts.some(c => c.toLowerCase().includes(q))) {
        results.push({ module: mod, lesson: les, matchedText: `Concept match in ${les.title}` });
        continue;
      }
      if (les.learningObjectives.some(obj => obj.toLowerCase().includes(q))) {
        results.push({ module: mod, lesson: les, matchedText: `Learning goal match in ${les.title}` });
        continue;
      }
      if (les.summary.toLowerCase().includes(q)) {
        results.push({ module: mod, lesson: les, matchedText: `Summary match: ${les.summary.slice(0, 80)}...` });
        continue;
      }
    }
  }

  return results;
}
