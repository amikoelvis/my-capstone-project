import { useEffect } from "react";
import { useQuizQuestionsStore } from "../store/quizQuestionsStore";
import { useQuizSettingsStore } from "../store/quizSettingsStore";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa"; // Import icons from react-icons
import Error from "./Error";
import Loader from "./Loader";

const Quiz = () => {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    isAnswered,
    isLoading,
    isStartingQuiz,
    error,
    setSelectedAnswer,
    nextQuestion,
    fetchQuizQuestions,
    setLoadingResults,
    setStartingQuiz,
  } = useQuizQuestionsStore();

  const { isLoadingCategories } = useQuizSettingsStore();

  useEffect(() => {
    if (!questions.length && !isLoading && !error && !isStartingQuiz) {
      fetchQuizQuestions(); // Fetch if no questions (e.g., Play Again)
    }
    if (isStartingQuiz) {
      setTimeout(() => {
        setStartingQuiz(false); // Reset after delay
      }, 500); // 500ms minimum Loader for "Start Quiz"
    }
  }, [questions, isLoading, error, isStartingQuiz, fetchQuizQuestions, setStartingQuiz]);

  if (!questions.length && !isLoading && !error && !isStartingQuiz) {
    return null; // Wait for fetch to start
  }

  if (!questions.length && !isLoading && !isStartingQuiz) {
    navigate("/"); // Redirect if no questions after fetch fails
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswerSelection = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      nextQuestion();
    } else {
      setLoadingResults(true); // Start loading results
      setTimeout(() => {
        navigate("/score"); // Navigate to Score after delay
      }, 500); // 500ms delay for UX
    }
  };

  // Define answer letters
  const answerLetters = ["A", "B", "C", "D"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-body p-4">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg text-center">
        {isLoading || isStartingQuiz || isLoadingCategories ? (
          <Loader />
        ) : error ? (
          <div className="text-center">
            <Error message={error} />
            <button
              onClick={fetchQuizQuestions}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold text-title mb-4">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </h2>
              <p
                className="text-lg font-medium text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.answers.map((answer, index) => {
                const isCorrect = answer === currentQuestion.correct_answer;
                const isSelected = selectedAnswer === answer;
                const showFeedback = isAnswered && isSelected;

                return (
                  <button
                    key={index}
                    className={`flex items-center justify-between p-3 text-white rounded-md font-semibold transition-all duration-300 bg-button hover:bg-opacity-80 ${
                      showFeedback
                        ? isCorrect
                          ? "border-2 border-green-500"
                          : "border-2 border-red-500"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() => handleAnswerSelection(answer)}
                    disabled={isAnswered}
                  >
                    {/* Letter with white background at the beginning */}
                    <span className="w-6 text-center bg-white text-black rounded-md h-6 flex items-center justify-center mr-2">
                      {answerLetters[index]}
                    </span>

                    {/* Answer text in the middle */}
                    <span
                      className="flex-1 text-center"
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />

                    {/* Feedback icon at the end using react-icons */}
                    <span className="w-6 text-right">
                      {showFeedback && (
                        isCorrect ? (
                          <FaCheck className="w-5 h-5 text-green-500 inline" />
                        ) : (
                          <FaTimes className="w-5 h-5 text-red-500 inline" />
                        )
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
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