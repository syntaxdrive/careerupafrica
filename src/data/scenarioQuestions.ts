// Scenario-based vetting questions for talent applications
// These test real-world problem-solving, not theoretical knowledge
// Minimum 250 words required per answer

export interface ScenarioQuestion {
  id: string;
  question: string;
  roleSpecific?: string[]; // If empty, applies to all roles
  minWords: number;
}

export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: 'missed_deadlines',
    question:
      "A founder you're working with keeps missing deadlines for feedback on your deliverables. You're three days away from your final deadline, and without their input, you can't complete the work. What do you do? Walk through your exact steps, including what you'd say and how you'd prevent this from happening again.",
    minWords: 250,
  },
  {
    id: 'unclear_brief',
    question:
      "You're assigned a task, but the brief is vague and missing key details (target audience, success metrics, deadline clarity). The founder is in a different timezone and won't be available for 12 hours. How do you move forward? What questions would you ask, and what would you clarify before starting?",
    minWords: 250,
  },
  {
    id: 'competing_priorities',
    question:
      "You're working on Task A when the founder sends an urgent message: 'Drop everything, I need Task B done by end of day.' Task A has a deadline tomorrow, and both are important. How do you handle this? What would you say to the founder, and how would you prioritize?",
    minWords: 250,
  },
];

// Role-specific scenarios (optional - can be added later)
export const roleSpecificQuestions: Record<string, ScenarioQuestion[]> = {
  operations: [
    {
      id: 'process_breakdown',
      question:
        "You notice the founder's current workflow for customer onboarding is costing them 5+ hours/week in manual work. They haven't asked you to fix it, but you can see the inefficiency. Do you bring it up? If so, how? What would your proposed solution include?",
      roleSpecific: ['operations'],
      minWords: 250,
    },
  ],
  virtual_assistant: [
    {
      id: 'calendar_conflict',
      question:
        "You're managing the founder's calendar. They've double-booked a critical investor call with a team meeting. Both are important. The investor's EA says they can't reschedule. How do you resolve this? Walk through your communication strategy step-by-step.",
      roleSpecific: ['virtual_assistant'],
      minWords: 250,
    },
  ],
  project_management: [
    {
      id: 'scope_creep',
      question:
        "You're managing a 4-week project. In week 2, the founder casually mentions adding 'one small feature' that would realistically take a week to build. The original deadline hasn't changed. How do you handle this conversation? What would you say, and what trade-offs would you present?",
      roleSpecific: ['project_management'],
      minWords: 250,
    },
  ],
  content: [
    {
      id: 'off_brand_request',
      question:
        "The founder asks you to write a LinkedIn post, but their request goes against what you know about effective content (too salesy, too long, unclear message). How do you push back professionally while respecting their authority? What would you say?",
      roleSpecific: ['content'],
      minWords: 250,
    },
  ],
  marketing: [
    {
      id: 'email_campaign_underperforming',
      question:
        "You launched an email campaign that's underperforming (8% open rate vs. 25% industry average). The founder is frustrated and wants to know what went wrong. How do you diagnose the issue? What specific changes would you test, and how would you communicate the results?",
      roleSpecific: ['marketing'],
      minWords: 250,
    },
  ],
};

// Get questions for a specific role
export function getQuestionsForRole(role: string): ScenarioQuestion[] {
  // Always return the 3 universal questions
  const universalQuestions = [...scenarioQuestions];

  // Add role-specific question if available
  const roleKey = role.toLowerCase().replace(' ', '_');
  if (roleSpecificQuestions[roleKey] && roleSpecificQuestions[roleKey].length > 0) {
    return [...universalQuestions.slice(0, 2), roleSpecificQuestions[roleKey][0]]; // 2 universal + 1 role-specific
  }

  // Return just the first 3 universal questions
  return universalQuestions.slice(0, 3);
}

// Word count helper
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Validation helper
export function validateAnswer(answer: string, minWords: number = 250): {
  isValid: boolean;
  wordCount: number;
  message?: string;
} {
  const wordCount = countWords(answer);

  if (wordCount < minWords) {
    return {
      isValid: false,
      wordCount,
      message: `Your answer needs at least ${minWords} words. Current: ${wordCount} words.`,
    };
  }

  return {
    isValid: true,
    wordCount,
  };
}
