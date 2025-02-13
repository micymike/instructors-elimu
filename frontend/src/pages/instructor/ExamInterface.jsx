import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExamInterface = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`'https://centralize-auth-elimu.onrender.com/api/assessments/${assessmentId}`);
        setExam(response.data);
        setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };
    fetchExam();
  }, [assessmentId]);

  useEffect(() => {
    if (!timeLeft || submitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const autoGradeExam = () => {
    let totalScore = 0;
    exam.questions.forEach(question => {
      const studentAnswer = answers[question._id];
      if (question.type === 'multiple_choice' && studentAnswer === question.correctAnswer) {
        totalScore += question.points;
      }
      // Add grading logic for other question types
    });
    return totalScore;
  };

  const handleSubmit = async () => {
    const calculatedScore = autoGradeExam();
    setScore(calculatedScore);
    setSubmitted(true);
    
    try {
      await axios.post(`'https://centralize-auth-elimu.onrender.com/api/assessments/${assessmentId}/submit`, {
        studentId: 'current_user_id', // Replace with actual user ID
        answers,
        score: calculatedScore
      });
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  if (loading) return <div>Loading exam...</div>;
  if (submitted) return (
    <div className="results-container">
      <h2>Exam Results</h2>
      <p>Your score: {score}/{exam.totalPoints}</p>
      <p>{score >= exam.passingScore ? 'Congratulations! You passed!' : 'Sorry, try again!'}</p>
    </div>
  );

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2>{exam.title}</h2>
        <div className="timer">
          Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className="questions-list">
        {exam.questions.map((question, index) => (
          <div key={question._id} className="question-card">
            <h3>Question {index + 1} ({question.points} points)</h3>
            <p>{question.text}</p>
            
            {question.type === 'multiple_choice' && (
              <div className="options">
                {question.choices.map((choice, i) => (
                  <label key={i}>
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={choice}
                      onChange={() => handleAnswerChange(question._id, choice)}
                    />
                    {choice}
                  </label>
                ))}
              </div>
            )}

            {question.type === 'essay' && (
              <textarea
                rows={4}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              />
            )}

            {/* Add more question type renderers */}
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmit}
        className="submit-btn"
        disabled={submitted}
      >
        Submit Exam
      </button>
    </div>
  );
};

export default ExamInterface;