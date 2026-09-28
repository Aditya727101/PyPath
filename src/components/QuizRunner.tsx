import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Quiz, QuizQuestion } from '../types/curriculum';
import { useProgress } from '../context/ProgressContext';

interface QuizRunnerProps {
  quiz: Quiz;
  onComplete?: (score: number, total: number, passed: boolean) => void;
  onAskAi?: (questionText: string, codeSnippet?: string) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz, onComplete, onAskAi }) => {
  const { recordQuizAttempt } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showReviewOnly, setShowReviewOnly] = useState(false);

  const currentQ: QuizQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleMultiSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    const current: number[] = selectedAnswers[questionId] || [];
    const updated = current.includes(optionIdx)
      ? current.filter(i => i !== optionIdx)
      : [...current, optionIdx];

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: updated,
    }));
  };

  const handleSubmit = async () => {
    // Grade questions deterministically
    let earned = 0;
    quiz.questions.forEach(q => {
      const studentAns = selectedAnswers[q.id];
      if (q.type === 'multi-select') {
        const correct = q.correctOptionIndices || [];
        const isExactMatch =
          Array.isArray(studentAns) &&
          studentAns.length === correct.length &&
          studentAns.every(val => correct.includes(val));
        if (isExactMatch) earned++;
      } else {
        if (studentAns === q.correctOptionIndex) {
          earned++;
        }
      }
    });

    setScore(earned);
    setIsSubmitted(true);
    const percentage = Math.round((earned / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScorePercent;

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore confetti errors
      }
    }

    await recordQuizAttempt({
      quizId: quiz.id,
      quizTitle: quiz.title,
      moduleId: quiz.moduleId,
      score: earned,
      totalQuestions,
      percentage,
      passed,
      userAnswers: selectedAnswers,
    });

    if (onComplete) {
      onComplete(earned, totalQuestions, passed);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setCurrentIndex(0);
    setShowReviewOnly(false);
  };

  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= quiz.passingScorePercent;

  // Filter questions for review
  const displayQuestions = showReviewOnly
    ? quiz.questions.filter(q => selectedAnswers[q.id] !== q.correctOptionIndex)
    : quiz.questions;

  const activeQuestion = displayQuestions[currentIndex] || quiz.questions[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">
            Assessment Engine
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">{quiz.title}</h2>
        </div>

        {!isSubmitted ? (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Question</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              <Award className="w-3.5 h-3.5" />
              <span>Score: {percentage}% ({score}/{totalQuestions})</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>

      {/* Question Navigator Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b border-slate-800/60">
        {quiz.questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctOptionIndex;
          const isWrong = isSubmitted && selectedAnswers[q.id] !== q.correctOptionIndex;

          let btnClass = 'bg-slate-800 text-slate-400 hover:bg-slate-700';
          if (idx === currentIndex) {
            btnClass = 'bg-indigo-600 text-white ring-2 ring-indigo-400 font-bold';
          } else if (isCorrect) {
            btnClass = 'bg-emerald-950 text-emerald-300 border border-emerald-800';
          } else if (isWrong) {
            btnClass = 'bg-rose-950 text-rose-300 border border-rose-800';
          } else if (isAnswered) {
            btnClass = 'bg-slate-700 text-slate-200';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all shrink-0 ${btnClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Display */}
      {activeQuestion && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base font-medium text-slate-100 leading-relaxed">
              <span className="text-indigo-400 font-bold mr-2">Q{currentIndex + 1}.</span>
              {activeQuestion.question}
            </h3>

            {onAskAi && (
              <button
                type="button"
                onClick={() => onAskAi(activeQuestion.question, activeQuestion.codeSnippet)}
                className="shrink-0 flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/70 border border-indigo-800/80 px-2.5 py-1 rounded-lg transition-colors"
                title="Ask AI Tutor for guidance"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="hidden sm:inline">Ask Tutor</span>
              </button>
            )}
          </div>

          {/* Optional Code Snippet */}
          {activeQuestion.codeSnippet && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{activeQuestion.codeSnippet}</pre>
            </div>
          )}

          {/* Options List */}
          <div className="space-y-2.5 pt-2">
            {activeQuestion.options?.map((optionText, optIdx) => {
              const isSelected = selectedAnswers[activeQuestion.id] === optIdx;
              const isCorrectOption = activeQuestion.correctOptionIndex === optIdx;

              let optionStyle = 'border-slate-800 bg-slate-850 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200';

              if (isSubmitted) {
                if (isCorrectOption) {
                  optionStyle = 'border-emerald-600 bg-emerald-950/40 text-emerald-200 font-medium';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'border-rose-600 bg-rose-950/40 text-rose-200';
                }
              } else if (isSelected) {
                optionStyle = 'border-indigo-500 bg-indigo-950/50 text-white font-medium ring-1 ring-indigo-500';
              }

              const letters = ['A', 'B', 'C', 'D', 'E'];

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(activeQuestion.id, optIdx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center space-x-3 transition-all cursor-pointer disabled:cursor-default ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {letters[optIdx]}
                  </span>
                  <span className="flex-1 text-sm font-sans">{optionText}</span>

                  {isSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-submission explanation */}
          {isSubmitted && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>Explanation:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{activeQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation & Submit Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-5 mt-6">
        <button
          type="button"
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {!isSubmitted ? (
          currentIndex === totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors cursor-pointer"
            >
              <span>Submit Assessment</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )
        ) : (
          <div className="flex items-center space-x-2">
            {!passed && (
              <button
                type="button"
                onClick={() => setShowReviewOnly(!showReviewOnly)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700"
              >
                {showReviewOnly ? 'Show All Questions' : 'Review Mistakes'}
              </button>
            )}
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Attempt Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
