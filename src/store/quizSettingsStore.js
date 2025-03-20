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
        set({ isLoadingCategories: true, error: null });
        try {
            const response = await fetch("https://opentdb.com/api_category.php");
            const data = await response.json();
            if (data.trivia_categories) {
                set({ categories: data.trivia_categories });
            }
        } catch (error) {
            set({ error: "Failed to load categories. Please try again." });
        } finally {
            set({ isLoadingCategories: false });
        }
    },

    setSelectedCategory: (category) => set({ selectedCategory: category }),

    setDifficulty: (difficulty) => set({ difficulty }),

    setNumQuestions: (num) =>
        set((state) => ({
            numQuestions: Math.max(1, Math.min(state.maxQuestions, Number(num))),
        })),
}));
