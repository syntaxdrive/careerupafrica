import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TalentApplication.css';
import { submitTalentApplication } from '../../lib/applicationService';

// We'll import these form components as we create them
import BasicInfoForm from './BasicInfoForm.tsx';
import ScenarioQuestionsForm from './ScenarioQuestionsForm.tsx';
import ConsentForm from './ConsentForm.tsx';

export interface TalentApplicationData {
  // Basic Info
  fullName: string;
  email: string;
  linkedinUrl: string;
  role: string;
  courseName?: string;
  hoursPerWeek: number;

  // Scenario Answers
  scenarioAnswer1: string;
  scenarioAnswer2: string;
  scenarioAnswer3: string;

  // Consent
  hasConsented: boolean;
}

type ApplicationStep = 'basic-info' | 'scenarios' | 'consent' | 'complete';

export default function TalentApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('basic-info');
  const [applicationData, setApplicationData] = useState<Partial<TalentApplicationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Progress calculation
  const stepOrder: ApplicationStep[] = ['basic-info', 'scenarios', 'consent', 'complete'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progressPercent = ((currentStepIndex + 1) / stepOrder.length) * 100;

  // Handle Basic Info completion
  const handleBasicInfoComplete = (data: Partial<TalentApplicationData>) => {
    setApplicationData((prev) => ({ ...prev, ...data }));
    setCurrentStep('scenarios');
    window.scrollTo(0, 0);
  };

  // Handle Scenario Questions completion
  const handleScenariosComplete = (data: Partial<TalentApplicationData>) => {
    setApplicationData((prev) => ({ ...prev, ...data }));
    setCurrentStep('consent');
    window.scrollTo(0, 0);
  };

  // Handle Consent & Final Submission
  const handleConsentComplete = async (data: Partial<TalentApplicationData>) => {
    setIsSubmitting(true);
    const finalData = { ...applicationData, ...data } as TalentApplicationData;

    try {
      // Submit to Supabase or localStorage (demo mode)
      const result = await submitTalentApplication(finalData);

      if (!result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      // Success!
      setApplicationData(finalData);
      setCurrentStep('complete');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Failed to submit application: ${errorMessage}\n\nPlease try again or contact support.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    const prevIndex = Math.max(0, currentStepIndex - 1);
    setCurrentStep(stepOrder[prevIndex]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="talent-application-page">
      {/* Header */}
      <div className="application-header">
        <h1>Apply as Talent</h1>
        <p>Show us how you think, not just what you know.</p>
      </div>

      {/* Progress Bar */}
      {currentStep !== 'complete' && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-steps">
            <span className={currentStep === 'basic-info' ? 'active' : ''}>1. Basic Info</span>
            <span className={currentStep === 'scenarios' ? 'active' : ''}>2. Scenarios</span>
            <span className={currentStep === 'consent' ? 'active' : ''}>3. Consent</span>
          </div>
        </div>
      )}

      {/* Form Steps */}
      <div className="application-content">
        {currentStep === 'basic-info' && (
          <BasicInfoForm
            initialData={applicationData}
            onComplete={handleBasicInfoComplete}
            onBack={() => navigate('/')}
          />
        )}

        {currentStep === 'scenarios' && (
          <ScenarioQuestionsForm
            role={applicationData.role || ''}
            initialData={applicationData}
            onComplete={handleScenariosComplete}
            onBack={handleBack}
          />
        )}

        {currentStep === 'consent' && (
          <ConsentForm
            applicationData={applicationData}
            onComplete={handleConsentComplete}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 'complete' && (
          <div className="completion-screen">
            <div className="completion-icon">✓</div>
            <h2>Application Submitted!</h2>
            <p>
              We've received your application. Our team will review your responses and get back to you within 5-7
              business days.
            </p>
            <p className="next-steps">
              <strong>What happens next?</strong>
              <br />
              1. Our team reviews your scenario responses for clarity, structure, and problem-solving approach.
              <br />
              2. If approved, you'll receive an invitation to join the next cohort.
              <br />
              3. You'll be matched with real projects where you can prove your competence.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
