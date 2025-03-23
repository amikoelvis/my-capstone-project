import { create } from "zustand";

export const useQuizSettingsStore = create((set) => ({
    categories: [],
    selectedCategory: "9",
    difficulty: "medium",
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
                const response = await fetch("https://opentdb.com/api_category.php");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.trivia_categories) {
                    set({ categories: data.trivia_categories });
                    break; // Success, exit loop
                } else {
                    throw new Error("No categories returned from API");
                }
            } catch (error) {
                retries++;
                if (retries === maxRetries) {
                    set({
                        error: `Failed to load categories after ${maxRetries} attempts. Please check your network and try again.`,
                    });
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 1000 * retries)); // Exponential backoff: 1s, 2s, 3s
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