import { useEffect } from "react";
import { useQuizQuestionsStore } from "../store/quizQuestionsStore";
import { useQuizSettingsStore } from "../store/quizSettingsStore";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import Error from "./Error";
import Loader from "./Loader";

const Quiz = () => {
  // Hook to navigate programmatically to different routes
  const navigate = useNavigate();

  // Destructure quiz questions state and actions from the quiz questions store
  const {
    questions,              // Array of quiz questions
    currentQuestionIndex,   // Index of the current question
    selectedAnswer,         // User’s selected answer for the current question
    isAnswered,             // Boolean indicating if the current question is answered
    isLoading,              // Boolean indicating if questions are being fetched
    isStartingQuiz,         // Boolean indicating if quiz is starting (e.g., from Home)
    error,                  // Error message if fetching questions fails
    setSelectedAnswer,      // Function to set the user’s selected answer
    nextQuestion,           // Function to move to the next question
    fetchQuizQuestions,     // Function to fetch quiz questions
    setLoadingResults,      // Function to set loading state for results
    setStartingQuiz,        // Function to reset the quiz starting state
  } = useQuizQuestionsStore();

  // Destructure loading state for categories from quiz settings store
  const { isLoadingCategories } = useQuizSettingsStore();

  // Effect hook to handle initial quiz setup or refetching questions
  useEffect(() => {
    // If no questions are loaded, not loading, no error, and not starting, fetch questions
    if (!questions.length && !isLoading && !error && !isStartingQuiz) {
      fetchQuizQuestions(); // E.g., triggered by "Play Again" from another route
    }
    // If quiz is starting (e.g., from Home), reset isStartingQuiz after a delay
    if (isStartingQuiz) {
      setTimeout(() => {
        setStartingQuiz(false); // Ensures Loader shows briefly for UX
      }, 500); // 500ms minimum delay
    }
  }, [questions, isLoading, error, isStartingQuiz, fetchQuizQuestions, setStartingQuiz]);

  // Effect hook to redirect to Home if no questions are available after fetch
  useEffect(() => {
    // If no questions, not loading, no error, and not starting, redirect to Home
    if (!questions.length && !isLoading && !error && !isStartingQuiz) {
      navigate("/"); // Prevents staying on Quiz page with no data
    }
  }, [questions, isLoading, error, isStartingQuiz, navigate]);

  // Early return to wait for fetch to start if no questions are present
  if (!questions.length && !isLoading && !error && !isStartingQuiz) {
    return null; // Avoids rendering until fetch begins
  }

  // Get the current question and total number of questions
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Handler for selecting an answer
  const handleAnswerSelection = (answer) => {
    if (!isAnswered) { // Only allow selection if question hasn’t been answered
      setSelectedAnswer(answer); // Update store with selected answer
    }
  };

  // Handler for moving to the next question or finishing the quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) { // If not the last question
      nextQuestion(); // Move to the next question
    } else { // If last question
      setLoadingResults(true); // Indicate results are being prepared
      setTimeout(() => {
        navigate("/score"); // Navigate to Score page after delay
      }, 500); // 500ms delay for better UX
    }
  };

  // Array of letters to label answer options (A, B, C, D)
  const answerLetters = ["A", "B", "C", "D"];

  return (
    // Outer container with full-screen centering and background styling
    <div className="flex items-center justify-center min-h-screen bg-body p-4 ">
      {/* Inner container with white background, max width, padding, and shadow */}
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg text-center ">
        {/* Conditional rendering based on loading, starting, or error states */}
        {isLoading || isStartingQuiz || isLoadingCategories ? (
          <Loader /> // Show loader during fetch, start, or category load
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
          // Main quiz content when data is ready
          <>
            {/* Question header */}
            <div>
              <h2 className="text-base font-normal mb-2 italic">
                Question {currentQuestionIndex + 1} of {totalQuestions} {/* Progress indicator */}
              </h2>
              <p
                className="text-lg font-bold text-black mb-6"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }} // Render HTML in question text
              />
            </div>
            {/* Answer options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.answers.map((answer, index) => {
                const isCorrect = answer === currentQuestion.correct_answer; // Check if answer is correct
                const isSelected = selectedAnswer === answer; // Check if answer is selected
                const showFeedback = isAnswered && isSelected; // Show feedback only for selected answer after answering

                return (
                  // Answer button with dynamic styling and feedback
                  <button
                    key={index} // Unique key for each answer
                    className={`bg-button-answer flex items-center justify-between p-3 rounded-md font-semibold transition-all duration-300 hover:bg-opacity-80 ${
                      showFeedback
                        ? isCorrect
                          ? "border-2 border-green-500" // Green border for correct
                          : "border-2 border-red-500"   // Red border for incorrect
                        : "border-2 border-transparent" // No border before answering
                    }`}
                    onClick={() => handleAnswerSelection(answer)} // Handle answer selection
                    disabled={isAnswered} // Disable after answering
                  >
                    {/* Letter label with white background */}
                    <span className="bg-white w-6 text-center text-black rounded-md h-6 flex items-center justify-center mr-2">
                      {answerLetters[index]} {/* Display A, B, C, or D */}
                    </span>

                    {/* Answer text */}
                    <span
                      className="flex-1 text-center text-black font-normal"
                      dangerouslySetInnerHTML={{ __html: answer }} // Render HTML in answer text
                    />

                    {/* Feedback icon */}
                    <span className="w-6 text-right">
                      {showFeedback && ( // Show icon only for selected answer after answering
                        isCorrect ? (
                          <FaCheck className="w-5 h-5 text-green-500 inline" /> // Checkmark for correct
                        ) : (
                          <FaTimes className="w-5 h-5 text-red-500 inline" />  // Cross for incorrect
                        )
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Next/Finish button, shown only after answering */}
            {isAnswered && (
              <button
                onClick={handleNextQuestion} // Move to next question or finish quiz
                className={`bg-button mt-6 px-6 py-2 text-white font-bold rounded-md hover:bg-opacity-80 transition-all duration-300 ${
                  isLoading || isStartingQuiz
                    ? "opacity-50 cursor-not-allowed" // Disabled style during loading
                    : "hover:bg-button-hover"         // Hover effect when active
                }`}
              >
                {currentQuestionIndex < totalQuestions - 1
                  ? "Next Question"
                  : "Check Score!"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;