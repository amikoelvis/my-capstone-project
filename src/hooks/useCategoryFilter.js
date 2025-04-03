import { useState, useEffect } from "react";

// Define the useCategoryFilter custom hook
// Takes categories (array), isLoadingCategories (boolean), and searchQuery (string) as arguments
const useCategoryFilter = (categories, isLoadingCategories, searchQuery) => {
  // State to hold the filtered list of categories based on the search query
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Effect hook to update filtered categories when dependencies change
  useEffect(() => {
    // Only proceed if there are categories and they’re not currently loading
    if (categories.length > 0 && !isLoadingCategories) {
      // Filter categories based on the search query
      const filtered = searchQuery
        ? categories.filter((category) =>
            // Convert category name and search query to lowercase for case-insensitive matching
            // Check if category name includes the trimmed search query
            category.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
          )
        : []; // Return an empty array if no search query is provided
      // Update the filteredCategories state with the filtered result
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories, isLoadingCategories]); // Dependencies: rerun effect if these change

  // Return the filtered categories for use in the calling component
  return filteredCategories;
};

export default useCategoryFilter;