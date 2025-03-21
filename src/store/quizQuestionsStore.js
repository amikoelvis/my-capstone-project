import { create } from "zustand";
import { useQuizSettingsStore } from "./quizSettingsStore";

export const useQuizQuestionsStore = create((set, get) => ({
    questions: [],
    isLoading: false,
    error: null,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    isAnswered: false,
    score: 0,

    fetchQuizQuestions: async () => {
        set({ isLoading: true, error: null, questions: [] });

        const { selectedCategory, numQuestions, difficulty } = useQuizSettingsStore.getState();
        const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.results.length > 0) {
                const formattedQuestions = data.results.map((q) => ({
                    ...q,
                    answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
                }));
                set({ questions: formattedQuestions });
            } else {
                set({ error: "No quiz questions available for this selection." });
            }
        } catch (error) {
            set({ error: "Error fetching quiz questions. Try again." });
        } finally {
            set({ isLoading: false });
        }
    },

    setSelectedAnswer: (answer) => {
        set((state) => ({
            selectedAnswer: answer,
            isAnswered: true,
            score: answer === state.questions[state.currentQuestionIndex].correct_answer
                ? state.score + 1
                : state.score,
        }));
    },

    nextQuestion: () => {
        set((state) => {
            if (state.currentQuestionIndex < state.questions.length - 1) {
                return {
                    currentQuestionIndex: state.currentQuestionIndex + 1,
                    selectedAnswer: null,
                    isAnswered: false,
                };
            }
            return state;
        });
    },

    updateScore: () => {
        set((state) => ({ score: state.score + 1 }));
    },

    resetQuiz: () => {
        set({ 
            currentQuestionIndex: 0, 
            selectedAnswer: null, 
            isAnswered: false, 
            score: 0, 
            questions: [] 
        });
    },
}));
