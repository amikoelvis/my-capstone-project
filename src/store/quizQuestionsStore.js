import { create } from "zustand";
import { useQuizSettingsStore } from "./quizSettingsStore";
import { quizService } from "../services/quizService";

// Create and export the quiz questions store using Zustand
export const useQuizQuestionsStore = create((set, get) => ({
  // Initial state properties
  questions: [],              // Array of quiz questions
  isLoading: false,           // Boolean indicating if questions are being fetched
  isLoadingResults: false,    // Boolean indicating if results are being prepared
  isStartingQuiz: false,      // Boolean indicating if quiz is starting
  error: null,                // Error message if fetching fails
  currentQuestionIndex: 0,    // Index of the current question
  selectedAnswer: null,       // User’s selected answer for the current question
  isAnswered: false,          // Boolean indicating if current question is answered
  score: 0,                   // Number of correct answers
  correctAnswers: [],         // Array of correctly answered questions
  incorrectAnswers: [],       // Array of incorrectly answered questions

  // Action to set questions directly
  setQuestions: (questions) => set({ questions }), // Updates questions state

  // Action to fetch quiz questions from the API with retry logic
  fetchQuizQuestions: async () => {
    const maxRetries = 3; // Maximum number of retry attempts
    let retries = 0;      // Current retry count
    // Set loading state and clear previous questions/error
    set({ isLoading: true, error: null, questions: [] });
    // Get quiz settings from the quiz settings store
    const { selectedCategory, numQuestions, difficulty } = useQuizSettingsStore.getState();

    // Retry loop for fetching questions
    while (retries < maxRetries) {
      try {
        // Fetch questions using quizService with current settings
        const data = await quizService.getQuizQuestions(
          numQuestions,
          selectedCategory,
          difficulty
        );

        // Check if questions were returned
        if (data.results.length > 0) {
          // Format questions by shuffling answers (incorrect + correct)
          const formattedQuestions = data.results.map((q) => ({
            ...q, // Spread original question data
            answers: [...q.incorrect_answers, q.correct_answer].sort(
              () => Math.random() - 0.5 // Randomize answer order
            ),
          }));
          // Update state with formatted questions and reset loading
          set({ questions: formattedQuestions, isLoading: false });
          return; // Exit function on success
        } else {
          // Set error if no questions are available
          set({ error: "No quiz questions available for this selection.", isLoading: false });
          return; // Exit function
        }
      } catch (error) {
        retries++; // Increment retry count
        if (retries === maxRetries) {
          // Set error after max retries reached
          set({
            error: `Failed to load questions after ${maxRetries} attempts: ${error.message}`,
            isLoading: false,
          });
        } else {
          // Wait before retrying, with increasing delay (1s, 2s, etc.)
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
        }
      }
    }
  },

  // Action to handle answer selection and update score/answers
  setSelectedAnswer: (answer) => {
    set((state) => {
      // Check if the selected answer is correct
      const isCorrect = answer === state.questions[state.currentQuestionIndex].correct_answer;
      const currentQuestion = state.questions[state.currentQuestionIndex]; // Current question object
      const answerLetters = ["A", "B", "C", "D"]; // Answer option letters
      // Get indices of correct and user answers in the shuffled array
      const correctAnswerIndex = currentQuestion.answers.indexOf(currentQuestion.correct_answer);
      const userAnswerIndex = currentQuestion.answers.indexOf(answer);
      const correctAnswerLetter = answerLetters[correctAnswerIndex]; // Letter for correct answer
      const userAnswerLetter = answerLetters[userAnswerIndex];       // Letter for user’s answer

      return {
        selectedAnswer: answer, // Set the selected answer
        isAnswered: true,       // Mark question as answered
        score: isCorrect ? state.score + 1 : state.score, // Increment score if correct
        correctAnswers: isCorrect
          ? [...state.correctAnswers, { ...currentQuestion, userAnswer: answer }] // Add to correct answers
          : state.correctAnswers, // No change if incorrect
        incorrectAnswers: !isCorrect
          ? [
              ...state.incorrectAnswers,
              {
                ...currentQuestion,         // Add question details
                userAnswer: answer,         // User’s incorrect answer
                correctAnswerLetter,        // Letter of correct answer
                userAnswerLetter,           // Letter of user’s answer
              },
            ]
          : state.incorrectAnswers, // No change if correct
      };
    });
  },

  // Action to move to the next question
  nextQuestion: () => {
    set((state) => {
      // Check if this is the last question
      const isLastQuestion = state.currentQuestionIndex >= state.questions.length - 1;
      if (!isLastQuestion) {
        return {
          currentQuestionIndex: state.currentQuestionIndex + 1, // Move to next question
          selectedAnswer: null,                                  // Clear selected answer
          isAnswered: false,                                     // Reset answered state
        };
      }
      return state; // No change if it’s the last question
    });
  },

  // Action to reset quiz and fetch new questions with same settings
  resetQuiz: async () => {
    // Reset most state properties and set loading
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
    // Fetch new questions using the existing fetch function
    await get().fetchQuizQuestions();
  },

  // Action to fully reset quiz state for a new quiz
  resetQuizState: () => {
    // Reset all state properties to initial values
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

  // Action to toggle loading results state
  setLoadingResults: (value) => set({ isLoadingResults: value }),

  // Action to toggle quiz starting state
  setStartingQuiz: (value) => set({ isStartingQuiz: value }),
}));