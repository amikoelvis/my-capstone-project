import React from "react";

// Defines a memoized Error component to display error messages
// React.memo prevents unnecessary re-renders when props don't change
const Error = React.memo(({ message }) => {

    return (
        <div
            className="text-red-500 bg-red-100 p-2 rounded"
            // Sets ARIA role to alert for screen readers
            role="alert"
            // Makes the error announcement immediate for assistive tech
            aria-live="assertive"
        >
            {/* Displays the error message passed through props */}
            {message}
        </div>
    );

});

export default Error;