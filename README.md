# Quiz Off!

Quiz Off! is an interactive React-based web application that allows users to create, take, and review custom quizzes. Users can configure quizzes by selecting a category (with real-time search filtering), difficulty, and number of questions, answer multiple-choice questions sourced from the [Open Trivia Database](https://opentdb.com/), and review their performance with a detailed score breakdown. The app uses Zustand for robust state management, ensuring a seamless and reliable user experience.

## Features

- **Quiz Configuration**: Set category, difficulty (easy, medium, hard), and number of questions (1-50) on the Home page.
- **Category Search**: Filter topics dynamically with a search input, powered by the `useCategoryFilter` hook.
- **Form Validation**: Ensures valid inputs using Yup schema validation.
- **Interactive Quiz**: Answer multiple-choice questions with visual feedback (green check for correct, red cross for incorrect).
- **Score Review**: View total score and detailed breakdown of incorrect answers with correct/user responses and answer letters.
- **State Management**: Uses Zustand stores (`quizSettingsStore` and `quizQuestionsStore`) for settings and quiz data.
- **Responsive Design**: Adapts to mobile and desktop with Tailwind CSS styling.
- **Loading & Error Handling**: Displays loaders during transitions and errors with retry/back options; includes retry logic for API calls.
- **Navigation**: Smooth transitions between Home, Quiz, and Score pages.
- **API Integration**: Fetches categories and questions from the Open Trivia Database API with retry mechanism.

## Tech Stack

- **React**: Frontend library for building the UI.
- **React Router**: For navigation (`/`, `/quiz`, `/score`).
- **Formik & Yup**: For form handling and validation on the Home page.
- **Zustand**: Lightweight state management for quiz settings and questions.
- **Axios**: For making HTTP requests to the Open Trivia Database API.
- **Tailwind CSS**: Utility-first CSS framework for styling (e.g., `bg-body`, `text-black`).
- **React Icons**: For feedback icons (check and cross).
- **Custom Hooks**: `useCategoryFilter` for real-time category filtering.

## Project Structure

```plaintext
src/
├── components/
│   ├── Error.js              # Memoized component for error messages
│   ├── Loader.js             # Memoized component for loading states
│   ├── Home.js               # Home page for quiz setup
│   ├── Quiz.js               # Quiz page for answering questions
│   ├── Score.js              # Score page for reviewing results
│   ├── Search.js             # Search component for category filtering
│
├── store/
│   ├── quizSettingsStore.js  # Zustand store for quiz settings (categories, difficulty, etc.)
│   ├── quizQuestionsStore.js # Zustand store for quiz questions and state
│
├── hooks/
│   ├── useCategoryFilter.js  # Custom hook for filtering categories
│
├── services/
│   ├── quizService.js        # API service for fetching categories and questions
│
├── index.js                  # App entry point
└── styles.css                # Global styles
```

## Installation

### Clone the Repository:

```bash
git clone <https://github.com/amikoelvis/my-capstone-project>
cd my-capstone-project
```

### Install Dependencies:

```bash
npm install
```

### Required Packages:

```bash
npm install react react-dom react-router-dom formik yup zustand axios react-icons tailwindcss
```

### Run the Development Server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or your configured port) in your browser.

## Usage

### Home Page (`/`):

- Configure your quiz: select a category, difficulty, and number of questions.
- Use the Search Topic field to filter categories; click a category to select it.
- Click "Start Quiz" to begin.

### Quiz Page (`/quiz`):

- Answer multiple-choice questions one at a time.
- Select an answer to see immediate feedback (green check for correct, red cross for incorrect).
- Click "Next Question" or "Check Score!" on the last question.

### Score Page (`/score`):

- View your total score (e.g., "3 out of 5").
- Review incorrect answers with question text, correct answer (with letter), and your answer (with letter).
- Choose "Play Again" (same settings) or "Start New Quiz" (new settings).

### Error Handling:

- Errors during API calls show a message with retry/back options; retries up to 3 times with increasing delays.

## Example

### Example `App.js` with Routing:

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Score from "./components/Score";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/score" element={<Score />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## API Endpoints

### Fetch Categories:

```bash
GET https://opentdb.com/api_category.php
```

**Response:**

```json
{
  "trivia_categories": [
    { "id": 9, "name": "General Knowledge" },
    { "id": 10, "name": "Entertainment: Books" }
  ]
}
```

### Fetch Questions:

```bash
GET https://opentdb.com/api.php?amount=<amount>&category=<category>&difficulty=<difficulty>&type=multiple
```

**Response:**

```json
{
  "response_code": 0,
  "results": [
    {
      "category": "General Knowledge",
      "type": "multiple",
      "difficulty": "easy",
      "question": "What is 2 + 2?",
      "correct_answer": "4",
      "incorrect_answers": ["2", "3", "5"]
    }
  ]
}
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## Contact

For questions or feedback, reach out to [amikoelvis@gmail.com](mailto:amikoelvis@gmail.com).
