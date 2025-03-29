import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizQuestionsStore } from "../store/quizQuestionsStore";
import { FaCheck, FaTimes } from "react-icons/fa";
import Loader from "./Loader";
import Error from "./Error";

const Score = () => {
  const navigate = useNavigate();
  const {
    score,
    questions,
    resetQuiz,
    resetQuizState,
    incorrectAnswers,
    isLoadingResults,
    isStartingQuiz,
    error,
    setLoadingResults,
    setStartingQuiz,
  } = useQuizQuestionsStore();
  const totalQuestions = questions.length;

  // Redirect to home if there are no questions
  useEffect(() => {
    if (!totalQuestions) {
      navigate("/");
    }
  }, [totalQuestions, navigate]);

  useEffect(() => {
    if (isLoadingResults) {
      setTimeout(() => {
        setLoadingResults(false);
      }, 500);
    }
  }, [isLoadingResults, setLoadingResults]);

  const handlePlayAgain = async () => {
    setStartingQuiz(true); // Indicate quiz restart
    await resetQuiz(); // Fetch new questions first
    setTimeout(() => {
      navigate("/quiz"); // Navigate to quiz after delay
    }, 500); // 500ms delay for UX
  };

  const handleStartNewQuiz = () => {
    resetQuizState();
    navigate("/");
  };

  // Map incorrect answers to their original question numbers
  const incorrectAnswersWithNumbers = incorrectAnswers.map((incorrect) => {
    const originalIndex = questions.findIndex(
      (q) => q.question === incorrect.question && q.correct_answer === incorrect.correct_answer
    );
    return {
      ...incorrect,
      questionNumber: originalIndex + 1, // 1-based numbering
    };
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-body p-4">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg text-center">
        {isLoadingResults || isStartingQuiz ? (
          <Loader /> // Show Loader when starting a new quiz or calculating results
        ) : error ? (
          <div className="text-center">
            <Error message={error} />
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-title mb-4">Quiz Completed!</h2>
            <p className="text-lg font-medium text-gray-700 mb-6">
              You scored {score} out of {totalQuestions}.
            </p>

            {incorrectAnswersWithNumbers.length > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="text-xl font-semibold text-title mb-2">
                  Review Incorrect Answers
                </h3>
                {incorrectAnswersWithNumbers.map((question, index) => (
                  <div key={index} className="mb-4 text-center">
                    <p>
                      <strong>Question {question.questionNumber}:</strong>{" "}
                      <span dangerouslySetInnerHTML={{ __html: question.question }} />
                    </p>
                    <p className="flex justify-center items-center">
                      <strong>Correct Answer:</strong>{" "}
                      <span className="ml-2 mr-2 p-3 rounded-md text-white flex items-center">
                        <span className="w-6 text-center bg-white text-black rounded-full h-6 flex items-center justify-center mr-2 border border-black">
                          {question.correctAnswerLetter}
                        </span>
                        <span
                          className="flex-1 text-center text-black"
                          dangerouslySetInnerHTML={{ __html: question.correct_answer }}
                        />
                        <FaCheck className="ml-2 w-5 h-5 text-green-500" />
                      </span>
                    </p>
                    <p className="flex justify-center items-center">
                      <strong>Your Answer:</strong>{" "}
                      <span className="ml-2 mr-2 p-3 rounded-md text-white flex items-center">
                        <span className="w-6 text-center bg-white text-black rounded-full h-6 flex items-center justify-center mr-2 border border-black">
                          {question.userAnswerLetter}
                        </span>
                        <span
                          className="flex-1 text-center text-black"
                          dangerouslySetInnerHTML={{
                            __html: question.userAnswer || "Not Answered",
                          }}
                        />
                        <FaTimes className="ml-2 w-5 h-5 text-red-500" />
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handlePlayAgain}
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Play Again
            </button>

            <button
              onClick={handleStartNewQuiz}
              className="mt-6 ml-4 px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700"
            >
              Start New Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Score;