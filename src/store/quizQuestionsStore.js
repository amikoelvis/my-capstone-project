import { create } from "zustand";
import { useQuizSettingsStore } from "./quizSettingsStore";

export const useQuizQuestionsStore = create((set, get) => ({
  questions: [],
  isLoading: false,
  isLoadingResults: false,
  isStartingQuiz: false,
  error: null,
  currentQuestionIndex: 0,
  selectedAnswer: null,
  isAnswered: false,
  score: 0,
  correctAnswers: [],
  incorrectAnswers: [],

  setQuestions: (questions) => set({ questions }),

  fetchQuizQuestions: async () => {
    const maxRetries = 3;
    let retries = 0;
    set({ isLoading: true, error: null, questions: [] });
    const { selectedCategory, numQuestions, difficulty } = useQuizSettingsStore.getState();
    const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`;

    while (retries < maxRetries) {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.results.length > 0) {
          const formattedQuestions = data.results.map((q) => ({
            ...q,
            answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          }));
          set({ questions: formattedQuestions, isLoading: false });
          return;
        } else {
          set({ error: "No quiz questions available for this selection.", isLoading: false });
          return;
        }
      } catch {
        retries++;
        if (retries === maxRetries) {
          set({
            error: `Failed to load questions after ${maxRetries} attempts. Please check your network and try again.`,
            isLoading: false,
          });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
        }
      }
    }
  },

  setSelectedAnswer: (answer) => {
    set((state) => {
      const isCorrect = answer === state.questions[state.currentQuestionIndex].correct_answer;
      const currentQuestion = state.questions[state.currentQuestionIndex];
      return {
        selectedAnswer: answer,
        isAnswered: true,
        score: isCorrect ? state.score + 1 : state.score,
        correctAnswers: isCorrect
          ? [...state.correctAnswers, { ...currentQuestion, userAnswer: answer }]
          : state.correctAnswers,
        incorrectAnswers: !isCorrect
          ? [...state.incorrectAnswers, { ...currentQuestion, userAnswer: answer }]
          : state.incorrectAnswers,
      };
    });
  },

  nextQuestion: () => {
    set((state) => {
      const isLastQuestion = state.currentQuestionIndex >= state.questions.length - 1;
      if (!isLastQuestion) {
        return {
          currentQuestionIndex: state.currentQuestionIndex + 1,
          selectedAnswer: null,
          isAnswered: false,
        };
      }
      return state;
    });
  },

  resetQuiz: async () => {
    set({
      score: 0,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswered: false,
      correctAnswers: [],
      incorrectAnswers: [],
      questions: [],
      isLoading: true,
      error: null,
    });
    await get().fetchQuizQuestions();
  },

  resetQuizState: () => {
    set({
      score: 0,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswered: false,
      correctAnswers: [],
      incorrectAnswers: [],
      questions: [],
      isLoading: false,
      isLoadingResults: false,
      isStartingQuiz: false,
      error: null,
    });
  },

  setLoadingResults: (value) => set({ isLoadingResults: value }),
  setStartingQuiz: (value) => set({ isStartingQuiz: value }),
}));