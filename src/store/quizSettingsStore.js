// store/quizSettingsStore.js
import { create } from "zustand";
import { quizService } from "../services/quizService";

export const useQuizSettingsStore = create((set) => ({ 
    categories: [],
    selectedCategory: "9",
    difficulty: "easy",
    numQuestions: "10",
    maxQuestions: "50",
    isLoadingCategories: false,
    error: null,

    fetchCategories: async () => {
        const maxRetries = 3;
        let retries = 0;

        set({ isLoadingCategories: true, error: null });

        while (retries < maxRetries) {
            try {
                const data = await quizService.getCategories();
                if (data.trivia_categories) {
                    set({ categories: data.trivia_categories });
                    break;
                } else {
                    throw new Error("No categories found!");
                }
            } catch (error) {
                retries++;
                if (retries === maxRetries) {
                    set({
                        error: `Failed to load categories after ${maxRetries} attempts: ${error.message}`,
                    });
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
                }
            }
        }
        set({ isLoadingCategories: false });
    },

    setSelectedCategory: (category) => set({ selectedCategory: category }), 
    setDifficulty: (difficulty) => set({ difficulty }),
    setNumQuestions: (num) =>
        set((state) => ({
            numQuestions: Math.max(1, Math.min(state.maxQuestions, Number(num))),
        })),
}));