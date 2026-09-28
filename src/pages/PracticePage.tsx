import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  Lightbulb,
  Play,
  RotateCcw,
  Check,
  XCircle,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { allExercises } from '../data/exercises';
import { Exercise } from '../types/curriculum';
import { CodeEditor } from '../components/CodeEditor';
import { pythonEngine } from '../services/pythonRunner';
import { useProgress } from '../context/ProgressContext';

interface PracticePageProps {
  onOpenAITutorWithContext: (codeSnippet?: string, userError?: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ onOpenAITutorWithContext }) => {
  const { solvedExercises, markExerciseSolved } = useProgress();

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(allExercises[0].id);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active exercise
  const currentExercise = allExercises.find(e => e.id === selectedExerciseId) || allExercises[0];

  // Code state
  const [userCode, setUserCode] = useState(currentExercise.starterCode);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; input: string; expected: string; actual: string; error?: string }[] | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Switch exercise handler
  const handleSelectExercise = (ex: Exercise) => {
    setSelectedExerciseId(ex.id);
    setUserCode(ex.starterCode);
    setRevealedHints([]);
    setShowSolution(false);
    setTestResults(null);
  };

  const handleRevealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints(prev => [...prev, index]);
    }
  };

  const handleRunTests = async () => {
    setIsTesting(true);
    setTestResults(null);

    const results: { passed: boolean; input: string; expected: string; actual: string; error?: string }[] = [];
    let allPassed = true;

    for (const tc of currentExercise.testCases) {
      // Execute function with input
      const testCode = `${userCode}\n\n# PyPath Test Execution\nprint(repr(${currentExercise.starterCode.match(/def\s+([a-zA-Z0-9_]+)/)?.[1] || 'solve'}(${tc.input})))`;

      try {
        const runRes = await pythonEngine.runCode(testCode);
        const actualClean = runRes.output.trim();
        const expectedClean = tc.expectedOutput.trim();

        // Remove quotes or extra repr formatting if matching
        const isMatch = actualClean === expectedClean || actualClean === `'${expectedClean}'` || actualClean === `"${expectedClean}"`;

        if (!isMatch) allPassed = false;
        results.push({
          passed: isMatch && runRes.success,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: actualClean,
          error: runRes.error,
        });
      } catch (err: any) {
        allPassed = false;
        results.push({
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: '',
          error: err?.message || 'Execution failed',
        });
      }
    }

    setTestResults(results);
    setIsTesting(false);

    if (allPassed) {
      markExerciseSolved(currentExercise.id);
    }
  };

  const isSolved = Boolean(solvedExercises[currentExercise.id]);

  const filteredList = allExercises.filter(ex => {
    const matchDiff = filterDifficulty === 'all' || ex.difficulty === filterDifficulty;
    const matchTopic = filterTopic === 'all' || ex.topic === filterTopic;
    const matchSearch = searchQuery.trim() === '' ||
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDiff && matchTopic && matchSearch;
  });

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Automated Evaluation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Python Practice & Problem Bank
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Solve problems of varying difficulty. Test your code against automated test cases with line-by-line feedback.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">
            {Object.keys(solvedExercises).length}/{allExercises.length} Solved
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem List & Filters */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search & Filter Controls */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-1.5">
              {['all', 'easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFilterDifficulty(d)}
                  className={`flex-1 py-1 rounded-md text-[11px] capitalize transition-colors ${
                    filterDifficulty === d
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* List of Problems */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredList.map(ex => {
              const solved = Boolean(solvedExercises[ex.id]);
              const active = ex.id === currentExercise.id;

              return (
                <div
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {solved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <h4 className="text-xs font-bold truncate max-w-[180px]">{ex.title}</h4>
                    </div>

                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold capitalize ${
                      ex.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-950/60' :
                      ex.difficulty === 'medium' ? 'text-amber-400 bg-amber-950/60' :
                      'text-rose-400 bg-rose-950/60'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 pl-6">
                    {ex.topic}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Problem Statement & Code Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Problem Details Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">{currentExercise.topic}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${
                    currentExercise.difficulty === 'easy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    currentExercise.difficulty === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {currentExercise.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{currentExercise.title}</h2>
              </div>

              {isSolved && (
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </div>
              )}
            </div>

            {/* Problem Statement text */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentExercise.problemStatement}
            </p>

            {/* Constraints */}
            {currentExercise.constraints && (
              <div className="text-xs space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Constraints:</span>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                  {currentExercise.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints Section */}
            <div className="pt-2 space-y-2">
              <div className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Need a Hint?</span>
              </div>
              <div className="space-y-1.5">
                {currentExercise.hints.map((hint, hIdx) => {
                  const isRevealed = revealedHints.includes(hIdx);
                  return (
                    <div key={hIdx}>
                      {isRevealed ? (
                        <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
                          <span className="font-semibold mr-1">Hint {hIdx + 1}:</span> {hint}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRevealHint(hIdx)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-slate-800"
                        >
                          Reveal Hint {hIdx + 1}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Playground Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Solution Workspace</span>
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRunTests}
                  disabled={isTesting}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isTesting ? 'Evaluating Tests...' : 'Run Test Cases'}</span>
                </button>
              </div>
            </div>

            {/* Revealed Reference Solution */}
            {showSolution && (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/50 space-y-2">
                <div className="text-xs font-bold text-emerald-400">Reference Solution:</div>
                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {currentExercise.solutionCode}
                </pre>
                <p className="text-[11px] text-slate-400 pt-1">{currentExercise.explanation}</p>
              </div>
            )}

            <CodeEditor
              initialCode={userCode}
              lessonTitle={currentExercise.title}
              onAskAi={(code, err) => onOpenAITutorWithContext(code, err)}
              height="300px"
            />
          </div>

          {/* Automated Test Results Runner Output */}
          {testResults && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Test Suite Evaluation</h4>
                <span className={`text-xs font-bold font-mono ${
                  testResults.every(r => r.passed) ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {testResults.filter(r => r.passed).length}/{testResults.length} Passed
                </span>
              </div>

              <div className="space-y-2">
                {testResults.map((tr, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-start justify-between gap-3 ${
                      tr.passed
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {tr.passed ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div>Input: <code>{tr.input}</code></div>
                        <div className="text-[11px] text-slate-400">Expected: {tr.expected}</div>
                        {!tr.passed && <div className="text-[11px] text-rose-400">Actual Output: {tr.actual || tr.error}</div>}
                      </div>
                    </div>

                    <span className="text-[10px] font-sans font-bold uppercase">
                      {tr.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
