import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizQuestionsStore } from "../store/quizQuestionsStore";
import { FaCheck, FaTimes } from "react-icons/fa";
import Loader from "./Loader";
import Error from "./Error";

const Score = () => {
  // Hook to navigate programmatically to different routes
  const navigate = useNavigate();

  // Destructure quiz state and actions from the quiz questions store
  const {
    score,              // Number of correct answers
    questions,          // Array of quiz questions
    resetQuiz,          // Function to fetch new questions for the same settings
    resetQuizState,     // Function to reset all quiz state for a new quiz
    incorrectAnswers,   // Array of incorrectly answered questions
    isLoadingResults,   // Boolean indicating if results are being prepared
    isStartingQuiz,     // Boolean indicating if quiz is restarting
    error,              // Error message if something fails
    setLoadingResults,  // Function to toggle loading results state
    setStartingQuiz,    // Function to toggle quiz starting state
  } = useQuizQuestionsStore();

  // Calculate total number of questions
  const totalQuestions = questions.length;

  // Effect hook to redirect to Home if no questions are present
  useEffect(() => {
    if (!totalQuestions) { // If no questions exist
      navigate("/");       // Redirect to Home page
    }
  }, [totalQuestions, navigate]);

  // Effect hook to handle loading results delay
  useEffect(() => {
    if (isLoadingResults) { // If loading results (e.g., from Quiz page)
      setTimeout(() => {
        setLoadingResults(false); // Reset loading state after delay
      }, 500); // 500ms delay for better UX
    }
  }, [isLoadingResults, setLoadingResults]);

  // Handler to restart the quiz with the same settings
  const handlePlayAgain = async () => {
    setStartingQuiz(true); // Indicate quiz is restarting
    await resetQuiz();     // Fetch new questions with current settings
    setTimeout(() => {
      navigate("/quiz");    // Navigate to Quiz page after delay
    }, 500); // 500ms delay for UX
  };

  // Handler to start a completely new quiz
  const handleStartNewQuiz = () => {
    resetQuizState(); // Reset all quiz state (e.g., score, questions)
    navigate("/");    // Navigate to Home to set new settings
  };

  // Map incorrect answers to include their original question numbers
  const incorrectAnswersWithNumbers = incorrectAnswers.map((incorrect) => {
    // Find the original index of the question in the questions array
    const originalIndex = questions.findIndex(
      (q) => q.question === incorrect.question && q.correct_answer === incorrect.correct_answer
    );
    return {
      ...incorrect,           // Spread original incorrect answer data
      questionNumber: originalIndex + 1, // Add 1-based question number
    };
  });

  return (
    // Outer container with full-screen centering and background styling
    <div className="flex items-center justify-center min-h-screen bg-body p-4">
      {/* Inner container with white background, max width, padding, and shadow */}
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg text-center">
        {/* Conditional rendering based on loading, starting, or error states */}
        {isLoadingResults || isStartingQuiz ? (
          <Loader /> // Show loader during results loading or quiz restart
        ) : error ? (
          // If there’s an error, show message and back button
          <div className="text-center">
            <Error message={error} />
            <button
              onClick={() => navigate("/")} // Navigate back to Home
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        ) : (
          // Main score content when data is ready
          <>
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2> {/* Completion header */}
            <p className="text-lg font-normal italic text-black mb-6">
              You scored {score} out of {totalQuestions}. {/* Display score */}
            </p>

            {/* Section for reviewing incorrect answers, if any */}
            {incorrectAnswersWithNumbers.length > 0 && (
              <div className="border border-body rounded-md p-4">
                <h3 className="text-xl font-medium mb-2">
                  Review Incorrect Answers {/* Section title */}
                </h3>
                {incorrectAnswersWithNumbers.map((question, index) => (
                  <div key={index} className="mb-4 text-left">
                    {/* Question text */}
                    <p>
                      <strong>Question {question.questionNumber}:</strong>{" "}
                      <span dangerouslySetInnerHTML={{ __html: question.question }} /> {/* Render HTML */}
                    </p>
                    {/* Correct answer with letter and icon */}
                    <p className="flex items-center pl-6">
                      <strong>Correct Answer:</strong>{" "}
                      <span className="ml-2 flex items-center">
                        <span className="border border-body w-6 text-center rounded-md h-6 mr-2">
                          {question.correctAnswerLetter} {/* Letter (e.g., A, B) */}
                        </span>
                        <span
                          className="flex-1"
                          dangerouslySetInnerHTML={{ __html: question.correct_answer }} // Render HTML
                        />
                        <FaCheck className="ml-2 w-5 h-5 text-green-500" /> {/* Checkmark icon */}
                      </span>
                    </p>
                    {/* User’s answer with letter and icon */}
                    <p className="flex items-center pl-6">
                      <strong>Your Answer:</strong>{" "}
                      <span className="ml-2 flex items-center">
                        <span className="border border-body w-6 text-center rounded-md h-6 mr-2">
                          {question.userAnswerLetter} {/* Letter (e.g., A, B) */}
                        </span>
                        <span
                          className="flex-1"
                          dangerouslySetInnerHTML={{
                            __html: question.userAnswer || "Not Answered", // Fallback if no answer
                          }}
                        />
                        <FaTimes className="ml-2 w-5 h-5 text-red-500" /> {/* Cross icon */}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Play Again button */}
            <button
              onClick={handlePlayAgain} // Restart quiz with same settings
              className="mt-6 px-6 py-2 bg-button text-white font-bold rounded-md hover:bg-button-hover"
            >
              Play Again {/* Button text */}
            </button>

            {/* Start New Quiz button */}
            <button
              onClick={handleStartNewQuiz} // Reset and go to Home for new settings
              className="mt-6 ml-4 px-6 py-2 bg-button text-white font-bold rounded-md hover:bg-button-hover"
            >
              Start New Quiz {/* Button text */}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Score;