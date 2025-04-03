import { Field } from "formik";

// Define the Search component as a functional component
// Props:
// - filteredCategories: Array of category objects filtered by search query
// - onCategorySelect: Callback function to handle category selection
// - searchQuery: Current search input value (string)
// - onSearchChange: Callback function to handle search input changes
const Search = ({ filteredCategories, onCategorySelect, searchQuery, onSearchChange }) => {
  // Render the search UI
  return (
    // Container div with bottom margin for spacing
    <div className="mb-4">
      {/* Label for the search input */}
      <label
        htmlFor="searchQuery" // Associates label with the input field
        className="block mb-2 text-title font-bold font-Fran" 
      >
        Search Topic: {/* Label text */}
      </label>

      {/* Formik Field component for the search input */}
      <Field
        type="text" // Input type: text
        id="searchQuery" // Unique ID for accessibility
        name="searchQuery" // Formik field name
        placeholder="Search for a topic..." // Placeholder text
        className="w-full p-2 border border-body rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Tailwind CSS styling: full width, padding, border, focus effects
        onChange={(e) => onSearchChange(e.target.value)} // Calls onSearchChange with input value on change
      />

      {/* Conditional message when search query exists but no categories match */}
      {searchQuery && filteredCategories.length === 0 && (
        <p className="text-gray-700 mt-2 italic">
          No topics found matching "<span className="font-semibold">{searchQuery}</span>".
          {/* Displays search query in bold within the message */}
        </p>
      )}

      {/* Conditional list of filtered categories when there are matches */}
      {filteredCategories.length > 0 && (
        // Unordered list with max height and scroll for overflow
        <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
          {/* Map through filtered categories to create clickable options */}
          {filteredCategories.map((category) => (
            <li key={category.id} // Unique key for each list item
            >
              {/* Button for selecting a category */}
              <button
                type="button" // Prevents form submission
                onClick={() => onCategorySelect(category.id)} // Calls onCategorySelect with category ID
                className="w-full text-left p-2 rounded-md bg-body text-gray-800 hover:bg-gray-300 transition-all duration-300" // Styling: full width, left-aligned text, hover effect
              >
                {category.name} {/* Category name as button text */}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;