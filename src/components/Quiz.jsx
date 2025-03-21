import { useQuizQuestionsStore } from "../store/quizQuestionsStore";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Quiz = () => {
    const navigate = useNavigate();
    const {
        questions,
        score,
        currentQuestionIndex,
        selectedAnswer,
        isAnswered,
        updateScore,
        setSelectedAnswer,
        nextQuestion,
        resetQuiz,
        isLoading
    } = useQuizQuestionsStore();

    if (isLoading) {
        return <Loader />;
    }

    if (!questions.length) {
        navigate("/");
        return null;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    const handleAnswerSelection = (answer) => {
        if (!isAnswered) {
            setSelectedAnswer(answer);
            if (answer === currentQuestion.correct_answer) {
                updateScore();
            }
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            nextQuestion();
        } else {
            navigate("/results");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold text-title mb-4">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </h2>
                <p className="text-lg font-medium text-gray-700 mb-6">
                    {currentQuestion.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.answers.map((answer, index) => (
                        <button
                            key={index}
                            className={`p-3 text-white rounded-md font-semibold transition-all duration-300
                                ${selectedAnswer === answer
                                    ? answer === currentQuestion.correct_answer
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    : "bg-button hover:bg-opacity-80"}`}
                            onClick={() => handleAnswerSelection(answer)}
                            disabled={isAnswered}
                        >
                            {answer}
                        </button>
                    ))}
                </div>
                {isAnswered && (
                    <button
                        onClick={handleNextQuestion}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "See Results"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
