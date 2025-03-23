import { useQuizQuestionsStore } from "../store/quizQuestionsStore";
import { useNavigate } from "react-router-dom";

const Score = () => {
    const navigate = useNavigate();
    const { score, questions, resetQuiz, resetQuizState, incorrectAnswers } = useQuizQuestionsStore();
    const totalQuestions = questions.length;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-title mb-4">Quiz Completed!</h2>
                <p className="text-lg font-medium text-gray-700 mb-6">
                    You scored {score} out of {totalQuestions}.
                </p>

                {incorrectAnswers.map((question, index) => (
                    <div key={index}>
                        <p><strong>Question:</strong> {question.question}</p>
                        <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
                        <p><strong>Your Answer:</strong> {question.userAnswer || "Not Answered"}</p>
                    </div>
                ))}

                <button
                    onClick={async () => {
                        await resetQuiz();
                        navigate("/quiz");
                    }}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                >
                    Play Again
                </button>

                <button
                    onClick={() => {
                        resetQuizState(); // Reset without fetching
                        navigate("/");    // Go to Home
                    }}
                    className="mt-6 ml-4 px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700"
                >
                    Start New Quiz
                </button>
            </div>
        </div>
    );
};

export default Score;