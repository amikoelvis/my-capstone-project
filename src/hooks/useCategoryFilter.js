import { useState, useEffect } from "react";

const useCategoryFilter = (categories, isLoadingCategories, searchQuery) => {
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    if (categories.length > 0 && !isLoadingCategories) {
      const filtered = searchQuery
        ? categories.filter((category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
          )
        : [];
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories, isLoadingCategories]);

  return filteredCategories;
};

export default useCategoryFilter;