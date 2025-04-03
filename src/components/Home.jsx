import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizSettingsStore } from "../store/quizSettingsStore";
import { useQuizQuestionsStore } from "../store/quizQuestionsStore";
import Loader from "./Loader";
import Error from "./Error";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Search from "./Search";
import useCategoryFilter from "../hooks/useCategoryFilter";

const Home = () => {
  // Hook to navigate programmatically to different routes
  const navigate = useNavigate();

  // Destructure quiz settings and related actions from the quiz settings store
  const {
    categories,              // Array of available quiz categories
    selectedCategory,        // Currently selected category ID
    difficulty,              // Selected difficulty level (easy, medium, hard)
    numQuestions,            // Number of questions for the quiz
    isLoadingCategories,     // Boolean indicating if categories are being fetched
    error,                   // Error message if category fetch fails
    fetchCategories,         // Function to fetch quiz categories
    setSelectedCategory,     // Function to update selected category
    setDifficulty,           // Function to update difficulty level
    setNumQuestions,         // Function to update number of questions
  } = useQuizSettingsStore();

  // Destructure quiz question actions from the quiz questions store
  const { 
    fetchQuizQuestions,      // Function to fetch quiz questions based on settings
    setStartingQuiz          // Function to set quiz starting state
  } = useQuizQuestionsStore();

  // State to manage the search query for filtering categories
  const [searchQuery, setSearchQuery] = useState("");

  // Uses custom hook to filter categories based on search query
  // Returns filtered list of categories
  const filteredCategories = useCategoryFilter(categories, isLoadingCategories, searchQuery);

  // Effect hook to fetch categories when the component mounts
  // Dependency on fetchCategories ensures it runs only if the function changes
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Define validation schema using Yup for form inputs
  const validationSchema = Yup.object({
    selectedCategory: Yup.string().required("Please select a category"), // Category must be selected
    difficulty: Yup.string()
      .oneOf(["easy", "medium", "hard"], "Invalid difficulty")          // Difficulty must be one of these values
      .required("Difficulty is required"),                              // Difficulty is mandatory
    numQuestions: Yup.number()
      .min(1, "Must be at least 1 question")                           // Minimum 1 question
      .max(50, "Cannot exceed 50 questions")                           // Maximum 50 questions
      .required("Please enter the number of questions"),               // Number of questions is mandatory
    searchQuery: Yup.string(),                                         // Optional search query field
  });

  // Handler function to start the quiz when form is submitted
  const handleStartQuiz = async (values) => {
    setSelectedCategory(values.selectedCategory);  // Update store with selected category
    setDifficulty(values.difficulty);              // Update store with selected difficulty
    setNumQuestions(values.numQuestions);          // Update store with number of questions
    setStartingQuiz(true);                         // Indicate quiz is starting
    await fetchQuizQuestions();                    // Fetch quiz questions based on settings
    setTimeout(() => {
      navigate("/quiz");                           // Navigate to quiz page after a short delay
    }, 500);                                       // 500ms delay for better user experience
  };

  return (
    // Outer container with full-screen centering and background styling
    <div className="flex items-center justify-center min-h-screen p-4 bg-body">
      {/* Inner container with white background, padding, rounded corners, and shadow */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center justify-between">
        {/* Left section: Welcome text */}
        <div className="w-full md:w-1/2 order-1 md:order-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl mb-2 font-bold">
            Welcome to Quiz Off!  {/* Main heading */}
          </h1>
          <p className="text-sm md:text-base italic font-light">
            Search or pick a topic, difficulty & number of questions to get started {/* Instruction text */}
          </p>
        </div>

        {/* Right section: Quiz setup form or loading/error states */}
        <div className="w-full md:w-1/2 order-2 md:order-2">
          {isLoadingCategories ? (  // Conditional rendering based on loading state
            <Loader />              // Show loader while categories are being fetched
          ) : error ? (             // If there's an error, show error message and retry button
            <div className="text-center">
              <Error message={error} />
              <button
                onClick={fetchCategories}  // Retry fetching categories on click
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-all duration-300"
              >
                Retry
              </button>
            </div>
          ) : (  // If no loading or error, render the quiz setup form
            <Formik
              initialValues={{  // Initial form values, synced with store or defaults
                selectedCategory: selectedCategory || "",
                difficulty: difficulty || "easy",
                numQuestions: numQuestions || 10,
                searchQuery: searchQuery,
              }}
              validationSchema={validationSchema}  // Apply validation rules
              onSubmit={handleStartQuiz}           // Handle form submission
            >
              {({ values, setFieldValue, isSubmitting }) => (  // Formik render props
                <Form className="w-full max-w-md space-y-4">
                  {/* Search component for filtering categories */}
                  <Search
                    filteredCategories={filteredCategories}  // Pass filtered categories to Search
                    onCategorySelect={(categoryId) => {      // Handle category selection
                      setFieldValue("selectedCategory", categoryId);  // Update form field
                      setFieldValue("searchQuery", "");               // Clear search query in form
                      setSearchQuery("");                             // Clear search query in state
                    }}
                    searchQuery={values.searchQuery}         // Pass current search query
                    onSearchChange={(value) => {             // Handle search input changes
                      setFieldValue("searchQuery", value);   // Update form field
                      setSearchQuery(value);                 // Sync with component state
                    }}
                  />

                  {/* Category selection dropdown */}
                  <div>
                    <label
                      htmlFor="selectedCategory"
                      className="block mb-2 font-bold"
                    >
                      Topic:
                    </label>
                    <Field
                      as="select"  // Render as a dropdown
                      id="selectedCategory"
                      name="selectedCategory"
                      className="w-full p-2 border border-body rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((cat) => (              // Map categories to options
                        <option key={cat.id} value={cat.id}>
                          {cat.name}  {/* Category name as option text */}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="selectedCategory"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* Difficulty selection dropdown */}
                  <div>
                    <label
                      htmlFor="difficulty"
                      className="block mb-2 font-bold"
                    >
                      Difficulty:  
                    </label>
                    <Field
                      as="select"  // Render as a dropdown
                      id="difficulty"
                      name="difficulty"
                      className="w-full p-2 border border-body rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">Easy</option>    {/* Difficulty options */}
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </Field>
                    <ErrorMessage
                      name="difficulty"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* Number of questions input */}
                  <div>
                    <label
                      htmlFor="numQuestions"
                      className="block mb-2 font-bold"
                    >
                      Number of Questions:
                    </label>
                    <Field
                      type="number"  // Render as a number input
                      id="numQuestions"
                      name="numQuestions"
                      className="w-full p-2 border border-body rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"  // Minimum value
                      max="50" // Maximum value
                    />
                    <ErrorMessage
                      name="numQuestions"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* Submit button to start the quiz */}
                  <button
                    type="submit"
                    disabled={isSubmitting}  // Disable while submitting
                    className={`w-full mt-4 p-2 text-white font-bold rounded-md bg-button ${
                      isSubmitting ? "opacity-50" : "hover:bg-button-hover"  // Conditional styling
                    } transition-all duration-300`}
                  >
                    {isSubmitting ? "Quiz Starting..." : "Start Quiz"}  {/* Button text based on state */}
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;