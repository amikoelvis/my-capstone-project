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
  const navigate = useNavigate();
  const {
    categories,
    selectedCategory,
    difficulty,
    numQuestions,
    isLoadingCategories,
    error,
    fetchCategories,
    setSelectedCategory,
    setDifficulty,
    setNumQuestions,
  } = useQuizSettingsStore();

  const { fetchQuizQuestions, setStartingQuiz } = useQuizQuestionsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const filteredCategories = useCategoryFilter(categories, isLoadingCategories, searchQuery);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const validationSchema = Yup.object({
    selectedCategory: Yup.string().required("Please select a category"),
    difficulty: Yup.string()
      .oneOf(["easy", "medium", "hard"], "Invalid difficulty")
      .required("Difficulty is required"),
    numQuestions: Yup.number()
      .min(1, "Must be at least 1 question")
      .max(50, "Cannot exceed 50 questions")
      .required("Please enter the number of questions"),
    searchQuery: Yup.string(),
  });

  const handleStartQuiz = async (values) => {
    setSelectedCategory(values.selectedCategory);
    setDifficulty(values.difficulty);
    setNumQuestions(values.numQuestions);
    setStartingQuiz(true);
    await fetchQuizQuestions();
    setTimeout(() => {
      navigate("/quiz"); // Navigate to quiz after delay
    }, 500); // 500ms delay for UX
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 p-6 bg-white rounded-lg">
        <div className="w-full md:w-1/2 order-1 md:order-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl mb-4 font-Mon text-title font-black">
            Welcome to Quiz Off!
          </h1>
          <p className="text-base sm:text-lg text-para font-Fran">
            Search or pick a topic, difficulty & number of questions to get started
          </p>
        </div>

        <div className="w-full md:w-1/2 order-2 md:order-2">
          {isLoadingCategories ? (
            <Loader />
          ) : error ? (
            <div className="text-center">
              <Error message={error} />
              <button
                onClick={fetchCategories}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-all duration-300"
              >
                Retry
              </button>
            </div>
          ) : (
            <Formik
              initialValues={{
                selectedCategory: selectedCategory || "",
                difficulty: difficulty || "easy",
                numQuestions: numQuestions || 10,
                searchQuery: searchQuery, // Sync with component state
              }}
              validationSchema={validationSchema}
              onSubmit={handleStartQuiz}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="w-full max-w-md space-y-4">
                  <Search
                    filteredCategories={filteredCategories}
                    onCategorySelect={(categoryId) => {
                      setFieldValue("selectedCategory", categoryId);
                      setFieldValue("searchQuery", "");
                      setSearchQuery(""); // Sync component state
                    }}
                    searchQuery={values.searchQuery}
                    onSearchChange={(value) => {
                      setFieldValue("searchQuery", value);
                      setSearchQuery(value); // Sync component state
                    }}
                  />

                  <div>
                    <label
                      htmlFor="selectedCategory"
                      className="block mb-2 text-title font-bold font-Fran"
                    >
                      Topic:
                    </label>
                    <Field
                      as="select"
                      id="selectedCategory"
                      name="selectedCategory"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Topic</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="selectedCategory"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="difficulty"
                      className="block mb-2 text-title font-bold font-Fran"
                    >
                      Difficulty:
                    </label>
                    <Field
                      as="select"
                      id="difficulty"
                      name="difficulty"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </Field>
                    <ErrorMessage name="difficulty" component="div" className="text-red-500" />
                  </div>

                  <div>
                    <label
                      htmlFor="numQuestions"
                      className="block mb-2 text-title font-bold font-Fran"
                    >
                      Number of Questions:
                    </label>
                    <Field
                      type="number"
                      id="numQuestions"
                      name="numQuestions"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="50"
                    />
                    <ErrorMessage name="numQuestions" component="div" className="text-red-500" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-4 p-2 text-white rounded-md bg-button ${
                      isSubmitting ? "opacity-50" : "hover:bg-opacity-80"
                    } transition-all duration-300`}
                  >
                    {isSubmitting ? "Quiz Starting..." : "Start Quiz"}
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