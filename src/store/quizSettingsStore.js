import { create } from "zustand";
import { quizService } from "../services/quizService";

// Create and export the quiz settings store using Zustand
export const useQuizSettingsStore = create((set) => ({
  // Initial state properties
  categories: [],           // Array of quiz categories fetched from the API
  selectedCategory: "9",    // Default selected category ID (e.g., General Knowledge)
  difficulty: "easy",       // Default difficulty level (easy, medium, hard)
  numQuestions: "10",       // Default number of questions as a string
  maxQuestions: "50",       // Maximum allowed number of questions as a string
  isLoadingCategories: false, // Boolean indicating if categories are being fetched
  error: null,              // Error message if fetching categories fails

  // Action to fetch quiz categories from the API with retry logic
  fetchCategories: async () => {
    const maxRetries = 3; // Maximum number of retry attempts
    let retries = 0;      // Current retry count

    // Set loading state and clear previous error
    set({ isLoadingCategories: true, error: null });

    // Retry loop for fetching categories
    while (retries < maxRetries) {
      try {
        // Fetch categories using quizService
        const data = await quizService.getCategories();
        // Check if categories were returned in the expected format
        if (data.trivia_categories) {
          // Update state with fetched categories and exit loop
          set({ categories: data.trivia_categories });
          break;
        } else {
          // Throw an error if no categories are found in the response
          throw new Error("No categories found!");
        }
      } catch (error) {
        retries++; // Increment retry count
        if (retries === maxRetries) {
          // Set error after max retries reached
          set({
            error: `Failed to load categories after ${maxRetries} attempts: ${error.message}`,
          });
        } else {
          // Wait before retrying, with increasing delay
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
        }
      }
    }
    // Reset loading state after success or failure
    set({ isLoadingCategories: false });
  },

  // Action to set the selected category
  setSelectedCategory: (category) => set({ selectedCategory: category }), // Updates selectedCategory state

  // Action to set the difficulty level
  setDifficulty: (difficulty) => set({ difficulty }), // Updates difficulty state

  // Action to set the number of questions with bounds checking
  setNumQuestions: (num) =>
    set((state) => ({
      // Ensure numQuestions is between 1 and maxQuestions, converting num to a number
      numQuestions: Math.max(1, Math.min(state.maxQuestions, Number(num))),
    })),
}));