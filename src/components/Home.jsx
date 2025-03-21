import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizSettingsStore } from "../store/quizSettingsStore";
import { useQuizQuestionsStore } from "../store/quizQuestionsStore";
import Loader from "./Loader";
import Error from "./Error";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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

    const { fetchQuizQuestions, isLoading } = useQuizQuestionsStore();

    useEffect(() => {
        fetchCategories();
    }, []);

    const validationSchema = Yup.object({
        selectedCategory: Yup.string().required("Please select a category"),
        difficulty: Yup.string().oneOf(["easy", "medium", "hard"], "Invalid difficulty").required("Difficulty is required"),
        numQuestions: Yup.number()
            .min(1, "Must be at least 1 question")
            .max(50, "Cannot exceed 50 questions")
            .required("Please enter the number of questions"),
    });

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center w-full max-w-lg p-6 mx-6 bg-white rounded-lg">
            <h1 className="text-3xl md:text-4xl mb-4 font-Mon text-title font-black">Welcome to Quiz Off!</h1>
            <p className="text-base sm:text-lg text-para mb-6 font-Fran">Test your knowledge and have fun!</p>

            {isLoadingCategories && <Loader />}
            {error && <Error message={error} />}

            <Formik
                initialValues={{
                    selectedCategory: selectedCategory || "",
                    difficulty: difficulty || "easy",
                    numQuestions: numQuestions || 10,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    // Update Zustand store before fetching questions
                    setSelectedCategory(values.selectedCategory);
                    setDifficulty(values.difficulty);
                    setNumQuestions(values.numQuestions);
                    await fetchQuizQuestions(); // Fetch questions based on updated store values
                    navigate("/quiz");
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="w-full max-w-md">
                        <label className="block mb-2 text-title font-bold font-Fran">Category:</label>
                        <Field 
                        as="select" 
                        name="selectedCategory" 
                        value={values.selectedCategory} // Controlled by Formik state
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => {
                            setFieldValue("selectedCategory", e.target.value); // Update Formik
                            setSelectedCategory(e.target.value); // Update Zustand state
                        }}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name="selectedCategory" component="div" className="text-red-500" />

                        <label className="block mt-4 mb-2 text-title font-bold font-Fran">Difficulty:</label>
                        <Field 
                        as="select" 
                        name="difficulty" 
                        value={values.difficulty}
                        onChange={(e) => {
                        setFieldValue("difficulty", e.target.value);
                        setDifficulty(e.target.value); // Update Zustand state
                        }}
                        className="w-full p-2 border rounded-md"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </Field>
                        <ErrorMessage name="difficulty" component="div" className="text-red-500" />

                        <label className="block mt-4 mb-2 text-title font-bold font-Fran">Number of Questions:</label>
                        <Field 
                        type="number" 
                        name="numQuestions" 
                        className="w-full p-2 border rounded-md" 
                        value={values.numQuestions}
                        onChange={(e) => {
                            setFieldValue("numQuestions", e.target.value);
                            setNumQuestions(Number(e.target.value)); // Update Zustand state
                        }}
                        />
                        <ErrorMessage name="numQuestions" component="div" className="text-red-500" />

                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className={`w-full mt-4 p-2 text-white rounded-md bg-button ${
                                isSubmitting || isLoading ? "opacity-50" : ""
                            }`}
                            aria-disabled={isSubmitting || isLoading}
                        >
                            {isSubmitting || isLoading ? "Quiz Starting..." : "Start Quiz"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
        </div>
    );
};

export default Home;
