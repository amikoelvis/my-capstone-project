// services/quizService.js
import axios from 'axios';

const BASE_URL = 'https://opentdb.com';

export const quizService = {
  getCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api_category.php`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.response?.status || error.message}`);
    }
  },

  getQuizQuestions: async (amount, category, difficulty) => {
    try {
      const response = await axios.get(`${BASE_URL}/api.php`, {
        params: {
          amount,
          category,
          difficulty,
          type: 'multiple'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch questions: ${error.response?.status || error.message}`);
    }
  }
};