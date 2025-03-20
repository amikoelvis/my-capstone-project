import { create } from "zustand";

export const useQuizQuestionsStore = create((set, get) => ({
    questions: [],
    isLoading: false,
    error: null,

    fetchQuizQuestions: async () => {
        set({ isLoading: true, error: null, questions: [] });

        const { selectedCategory, numQuestions, difficulty } =
            get().useQuizSettingsStore();

        const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.results.length > 0) {
                set({ questions: data.results });
            } else {
                set({ error: "No quiz questions available for this selection." });
            }
        } catch (error) {
            set({ error: "Error fetching quiz questions. Try again." });
        } finally {
            set({ isLoading: false });
        }
    },
}));
