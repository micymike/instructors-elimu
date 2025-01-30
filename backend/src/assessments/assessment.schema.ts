// Enums
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  MATCHING = 'matching'
}

export enum AssessmentType {
  ASSIGNMENT = 'ASSIGNMENT',
  QUIZ = 'QUIZ'
}

// Question Schema Structure
interface Question {
  type: QuestionType;
  text: string;
  points: number; // Default: 1
  
  // Multiple Choice Specific
  choices?: {
    text: string;
    isCorrect: boolean;
  }[];
  
  // True/False Specific
  correctAnswer?: boolean;
  
  // Matching Specific
  matchingPairs?: {
    term: string;
    definition: string;
  }[];
}

// Full Assessment Schema
interface Assessment {
  // Required Fields
  title: string;
  courseId: string; // ObjectId reference to Course
  instructorId: string; // ObjectId reference to User
  type: AssessmentType;
  questions: Question[];

  // Optional Fields
  description?: string;
  
  // Scoring and Timing
  totalPoints: number; // Auto-calculated
  passingScore: number; // Default: 70
  timeLimit: number; // 0 means no time limit
  dueDate?: Date;

  // Status Flags
  isPublished: boolean; // Default: false
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Example of Creating an Assessment
const sampleAssessment: Assessment = {
  title: "Midterm Exam",
  courseId: "course_objectId",
  instructorId: "instructor_objectId",
  type: AssessmentType.QUIZ,
  description: "Comprehensive midterm assessment",
  questions: [
    {
      type: QuestionType.MULTIPLE_CHOICE,
      text: "What is the capital of France?",
      points: 2,
      choices: [
        { text: "London", isCorrect: false },
        { text: "Paris", isCorrect: true },
        { text: "Berlin", isCorrect: false }
      ]
    },
    {
      type: QuestionType.TRUE_FALSE,
      text: "The Earth revolves around the Sun",
      points: 1,
      correctAnswer: true
    }
  ],
  totalPoints: 3, // Add totalPoints property
  passingScore: 70,
  timeLimit: 60, // 60 minutes
  dueDate: new Date('2025-02-15'),
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date()
};
