import React from "react";

const Error = React.memo(({ message }) => {
    return (
        <div
            className="text-red-500 bg-red-100 p-2 rounded"
            role="alert"
            aria-live="assertive"
        >
            {message}
        </div>
    );
});

export default Error;
