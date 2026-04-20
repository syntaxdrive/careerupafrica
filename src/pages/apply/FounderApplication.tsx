import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FounderApplication.css';
import { submitFounderApplication } from '../../lib/founderApplicationService';

import FounderInfoForm from './FounderInfoForm';
import FounderConsentForm from './FounderConsentForm';

export interface FounderApplicationData {
  // Basic Info
  fullName: string;
  email: string;
  companyName: string;
  industry?: string;
  companyStage: string;
  linkedinUrl?: string;
  websiteUrl?: string;

  // Project Details
  helpNeeded: string;
  hoursPerWeek: number;

  // Consent
  hasConsented: boolean;
}

type ApplicationStep = 'info' | 'consent' | 'complete';

export default function FounderApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('info');
  const [applicationData, setApplicationData] = useState<Partial<FounderApplicationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Progress calculation
  const stepOrder: ApplicationStep[] = ['info', 'consent', 'complete'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progressPercent = ((currentStepIndex + 1) / stepOrder.length) * 100;

  // Handle Info Form completion
  const handleInfoComplete = (data: Partial<FounderApplicationData>) => {
    setApplicationData((prev) => ({ ...prev, ...data }));
    setCurrentStep('consent');
    window.scrollTo(0, 0);
  };

  // Handle Consent & Final Submission
  const handleConsentComplete = async (data: Partial<FounderApplicationData>) => {
    setIsSubmitting(true);
    const finalData = { ...applicationData, ...data } as FounderApplicationData;

    try {
      // Submit to Supabase or localStorage (demo mode)
      const result = await submitFounderApplication(finalData);

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
    <div className="founder-application-page">
      {/* Header */}
      <div className="application-header">
        <h1>Apply as Founder</h1>
        <p>Get matched with vetted talent to build your vision.</p>
      </div>

      {/* Progress Bar */}
      {currentStep !== 'complete' && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-steps">
            <span className={currentStep === 'info' ? 'active' : ''}>1. Company Info</span>
            <span className={currentStep === 'consent' ? 'active' : ''}>2. Consent</span>
          </div>
        </div>
      )}

      {/* Form Steps */}
      <div className="application-content">
        {currentStep === 'info' && (
          <FounderInfoForm
            initialData={applicationData}
            onComplete={handleInfoComplete}
            onBack={() => navigate('/')}
          />
        )}

        {currentStep === 'consent' && (
          <FounderConsentForm
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
              We've received your application. Our team will review it and get back to you within 3-5 business days.
            </p>
            <p className="next-steps">
              <strong>What happens next?</strong>
              <br />
              1. Our team reviews your company information and project needs.
              <br />
              2. If approved, you'll receive access to post projects for vetted talent.
              <br />
              3. You'll be matched with participants who can help build your vision.
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
