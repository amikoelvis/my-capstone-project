import { Field } from "formik";

const Search = ({ filteredCategories, onCategorySelect, searchQuery, onSearchChange }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="searchQuery"
        className="block mb-2 text-title font-bold font-Fran"
      >
        Search Topic:
      </label>
      <Field
        type="text"
        id="searchQuery"
        name="searchQuery"
        placeholder="Search for a topic..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && filteredCategories.length === 0 && (
        <p className="text-gray-700 mt-2 italic">
          No topics found matching "<span className="font-semibold">{searchQuery}</span>".
        </p>
      )}
      {filteredCategories.length > 0 && (
        <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
          {filteredCategories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onCategorySelect(category.id)}
                className="w-full text-left p-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300"
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;