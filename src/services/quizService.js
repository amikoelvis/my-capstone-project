import axios from "axios";

// Define the base URL for the Open Trivia Database API
const BASE_URL = "https://opentdb.com";

// Export an object containing quiz-related service functions
export const quizService = {
  // Function to fetch quiz categories from the API
  getCategories: async () => {
    try {
      // Make a GET request to the API endpoint for categories
      const response = await axios.get(`${BASE_URL}/api_category.php`);
      // Return the data from the response (expected to contain trivia_categories)
      return response.data;
    } catch (error) {
      // Throw a custom error with details if the request fails
      throw new Error(
        `Failed to fetch categories: ${error.response?.status || error.message}`
      );
    }
  },

  // Function to fetch quiz questions based on specified parameters
  getQuizQuestions: async (amount, category, difficulty) => {
    try {
      // Make a GET request to the API endpoint for questions with query parameters
      const response = await axios.get(`${BASE_URL}/api.php`, {
        params: {
          amount,      // Number of questions to fetch
          category,    // Category ID for filtering questions
          difficulty,  // Difficulty level (e.g., easy, medium, hard)
          type: "multiple" // Restrict to multiple-choice questions
        },
      });
      // Return the data from the response (expected to contain results array)
      return response.data;
    } catch (error) {
      // Throw a custom error with details if the request fails
      throw new Error(
        `Failed to fetch questions: ${error.response?.status || error.message}`
      );
    }
  },
};