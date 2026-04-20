import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import './ApplicationForms.css';
import type { TalentApplicationData } from './TalentApplication';
import { getQuestionsForRole, countWords, validateAnswer } from '../../data/scenarioQuestions';

interface ScenarioQuestionsFormProps {
  role: string;
  initialData: Partial<TalentApplicationData>;
  onComplete: (data: Partial<TalentApplicationData>) => void;
  onBack: () => void;
}

interface ScenarioFormData {
  scenarioAnswer1: string;
  scenarioAnswer2: string;
  scenarioAnswer3: string;
}

export default function ScenarioQuestionsForm({
  role,
  initialData,
  onComplete,
  onBack,
}: ScenarioQuestionsFormProps) {
  const questions = getQuestionsForRole(role);
  const [wordCounts, setWordCounts] = useState<number[]>([0, 0, 0]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ScenarioFormData>({
    defaultValues: {
      scenarioAnswer1: initialData.scenarioAnswer1 || '',
      scenarioAnswer2: initialData.scenarioAnswer2 || '',
      scenarioAnswer3: initialData.scenarioAnswer3 || '',
    },
  });

  // Watch all answers for live word count
  const answer1 = watch('scenarioAnswer1');
  const answer2 = watch('scenarioAnswer2');
  const answer3 = watch('scenarioAnswer3');

  useEffect(() => {
    setWordCounts([countWords(answer1 || ''), countWords(answer2 || ''), countWords(answer3 || '')]);
  }, [answer1, answer2, answer3]);

  const onSubmit = (data: ScenarioFormData) => {
    // Validate all answers meet minimum word count
    const allValid = [data.scenarioAnswer1, data.scenarioAnswer2, data.scenarioAnswer3].every((answer) => {
      const validation = validateAnswer(answer);
      return validation.isValid;
    });

    if (!allValid) {
      alert('Please ensure all answers meet the 250-word minimum.');
      return;
    }

    onComplete(data);
  };

  const getWordCountClass = (wordCount: number, minWords: number = 250): string => {
    if (wordCount === 0) return '';
    if (wordCount < minWords) return 'insufficient';
    return 'sufficient';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="application-form">
      <h2>Scenario-Based Questions</h2>
      <p className="form-subtitle">
        These aren't trick questions. We want to see how you think through real problems, not recite theory.
      </p>

      <div className="info-box">
        <p>
          <strong>Important:</strong> Each answer must be at least 250 words. Quality matters more than quantity, but
          we need enough detail to understand your thought process.
        </p>
      </div>

      {/* Question 1 */}
      <div className="form-group">
        <div className="question-label">
          <span className="question-number">1</span>
          <span className="question-text">{questions[0].question}</span>
        </div>
        <textarea
          {...register('scenarioAnswer1', {
            required: 'This answer is required',
            validate: (value) => {
              const validation = validateAnswer(value);
              return validation.isValid || validation.message;
            },
          })}
          placeholder="Start typing your answer here..."
        />
        <div className={`word-count ${getWordCountClass(wordCounts[0])}`}>
          {wordCounts[0]} / 250 words {wordCounts[0] >= 250 && '✓'}
        </div>
        {errors.scenarioAnswer1 && <span className="error-message">{errors.scenarioAnswer1.message}</span>}
      </div>

      {/* Question 2 */}
      <div className="form-group">
        <div className="question-label">
          <span className="question-number">2</span>
          <span className="question-text">{questions[1].question}</span>
        </div>
        <textarea
          {...register('scenarioAnswer2', {
            required: 'This answer is required',
            validate: (value) => {
              const validation = validateAnswer(value);
              return validation.isValid || validation.message;
            },
          })}
          placeholder="Start typing your answer here..."
        />
        <div className={`word-count ${getWordCountClass(wordCounts[1])}`}>
          {wordCounts[1]} / 250 words {wordCounts[1] >= 250 && '✓'}
        </div>
        {errors.scenarioAnswer2 && <span className="error-message">{errors.scenarioAnswer2.message}</span>}
      </div>

      {/* Question 3 */}
      <div className="form-group">
        <div className="question-label">
          <span className="question-number">3</span>
          <span className="question-text">{questions[2].question}</span>
        </div>
        <textarea
          {...register('scenarioAnswer3', {
            required: 'This answer is required',
            validate: (value) => {
              const validation = validateAnswer(value);
              return validation.isValid || validation.message;
            },
          })}
          placeholder="Start typing your answer here..."
        />
        <div className={`word-count ${getWordCountClass(wordCounts[2])}`}>
          {wordCounts[2]} / 250 words {wordCounts[2] >= 250 && '✓'}
        </div>
        {errors.scenarioAnswer3 && <span className="error-message">{errors.scenarioAnswer3.message}</span>}
      </div>

      {/* Tips */}
      <div className="info-box">
        <p>
          <strong>Tips for strong answers:</strong>
          <br />
          • Be specific - avoid vague responses like "I'd communicate better"
          <br />
          • Show your process - walk through exact steps you'd take
          <br />
          • Consider trade-offs - acknowledge there's no perfect solution
          <br />• Think like a professional - how would someone experienced handle this?
        </p>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button type="submit" className="btn-primary">
          Continue to Consent →
        </button>
      </div>
    </form>
  );
}
