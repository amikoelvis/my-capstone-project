import React from "react";

// Defines a memoized Loader component to show loading state
// React.memo optimizes performance by preventing unnecessary re-renders
const Loader = React.memo(() => {
    
    return (
        <div className="text-center text-blue-600">
            Loading...
        </div>
    );

});

export default Loader;