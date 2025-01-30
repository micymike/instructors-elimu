"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentType = exports.QuestionType = void 0;
var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["TRUE_FALSE"] = "true_false";
    QuestionType["SHORT_ANSWER"] = "short_answer";
    QuestionType["ESSAY"] = "essay";
    QuestionType["MATCHING"] = "matching";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["ASSIGNMENT"] = "ASSIGNMENT";
    AssessmentType["QUIZ"] = "QUIZ";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
const sampleAssessment = {
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
    totalPoints: 3,
    passingScore: 70,
    timeLimit: 60,
    dueDate: new Date('2025-02-15'),
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
};
//# sourceMappingURL=assessment.schema.js.map